# Admin Dashboard – Handoff Complet

Ce document fournit tout ce qu’un développeur externe a besoin pour construire un Admin Dashboard pour Lift & Eat, connecté à Convex (Cloud) et sécurisé via Clerk.

Dernière mise à jour: 2025-10-02 11:37 (+01:00)

---

## 1) Objectifs & Portée

- Gérer le catalogue d’assets publics (ingrédients, repas, composition des repas) avec i18n (FR/EN/AR).
- Visualiser les KPIs/analytics (DAU, événements, top assets, latence).
- Support utilisateur (lecture seule): consulter utilisateur, plans, entrées journalières, favoris, ingrédients/repas personnalisés.
- Opérations de seed/maintenance: exécuter une mise à jour idempotente des seeds (via action Convex) et gérer la version `assetsDataVersion`.

Non inclus (nécessite dev backend complémentaire):
- Édition directe des assets via mutations publiques (actuellement internes). Aujourd’hui l’édition passe par un « seed » idempotent via `actions/seedAssets.ts` et un `SEED_ADMIN_TOKEN`.

---

## 2) Déploiement Convex & Auth

- Convex (ownDev): `https://fabulous-stork-993.convex.cloud`
- Dashboard Convex: `https://dashboard.convex.dev/d/fabulous-stork-993`
- Auth provider: Clerk
  - Fichier: `convex/auth.config.ts`
  - Issuer (Clerk): `https://sought-humpback-85.clerk.accounts.dev`
  - ApplicationID (Clerk JWT Template): `convex`

Accès Admin (seed):
- Action protégée par `SEED_ADMIN_TOKEN` (variable d’environnement côté Convex)
- Les queries Analytics et Assets sont publiques par défaut (ne vérifient pas l’identité), les données « user-owned » (plans, saved_meals, custom_*) sont protégées (auth requise).

---

## 3) Modèle de Données (Convex)

Référence: `convex/schema.ts`

- `ingredients` (public, seeds)
  - slug, name, nameI18n { fr, en?, ar? }, nameNormalized, synonyms[], tags[], unit, macrosPer100g { kcal, protein, carbs, fat }, imageKey?, source, sourceVersion, createdAt
  - Index: by_slug, by_nameNormalized; SearchIndex: search_name

- `meals` (public, seeds)
  - slug, name, nameI18n, descriptionI18n, nameNormalized, tags[], imageKey?, source, sourceVersion, createdAt
  - Index: by_slug, by_nameNormalized; SearchIndex: search_name

- `meal_ingredients` (public, seeds – composition)
  - mealSlug, ingredientSlug, quantityGr, cookingMethod?
  - Index: by_mealSlug, by_ingredientSlug

- `events` (analytics/KPIs)
  - eventType, ts, anonymousId, userId?, sessionId?, payload:any, appVersion?
  - Index: by_type_ts, by_userId, by_anonymousId

- `users` (owner-only)
  - userId (Clerk subject), createdAt, updatedAt?, locale?, appVersion?, platform?, displayName?, avatarUrl?, preferences:any
  - Index: by_userId

- `plans` (owner-only, SoT cloud)
  - userId, name, goal?, unit?, initialWeight?, targetWeight?, calories?, carbs?, fat?, protein?, durationWeeks?, startDate?, current?, completed?, clientId?, createdAt, updatedAt
  - Index: by_user, by_user_current, by_user_clientId

- `plan_days` (owner-only)
  - planId:Id<'plans'>, date:YYYY-MM-DD, calories?, carbs?, fat?, protein?, createdAt, updatedAt
  - Index: by_plan, by_plan_date

- `plan_entries` (owner-only)
  - userId, day:YYYY-MM-DD, slot, kind ('meal'|'ingredient'), refType ('seed'|'custom'), refKey (slug|clientId), quantity, unit?, planId?:Id<'plans'>, clientId?, idempotenceKey, createdAt, updatedAt
  - Index: by_user_day, by_user, by_idem (userId+idempotenceKey), by_user_clientId, by_user_plan_day, by_user_plan

- `water_logs` (owner-only)
  - userId, day, ts, ml, source?, deviceId?
  - Index: by_user_day, by_user_ts

- `saved_meals` (owner-only, favoris)
  - userId, refType ('seed'|'custom'), refKey, note?, createdAt
  - Index: by_user, by_user_ref

- `meta`
  - key, value:any (ex: assetsDataVersion)
  - Index: by_key

- `custom_ingredients` (owner-only)
  - userId, clientId, name?, macrosPer100g, unit?, imageKey?, barcode?, source?, createdAt, updatedAt
  - Index: by_user_clientId, by_user

- `custom_meals` (owner-only)
  - userId, clientId, name?, macrosPer100g, imageKey?, createdAt, updatedAt
  - Index: by_user_clientId, by_user

---

## 4) API Convex (existant)

Répertoires: `convex/queries/` et `convex/mutations/` (+ `convex/actions/`)

- Assets (public)
  - `queries/assets.ts`
    - `getIngredientBySlug(slug)`
    - `listIngredients(page?, limit?)` (MVP: pagination en mémoire)
    - `searchIngredients(q, page?, limit?)` (range by_nameNormalized)
    - `listIngredientsByTag(tag, page?, limit?)`
    - `getMealBySlug(slug)`
    - `listMeals(page?, limit?)`
    - `listMealsByTag(tag, page?, limit?)`
    - `getMealIngredientsBySlug(slug)`
  - `mutations/assets.ts` (internalMutation – non appelable côté client)
    - `upsertIngredient({ ... })`
    - `upsertMeal({ ... })`
    - `upsertMealIngredient({ ... })`
    - `setMetaKey(key, value)`
  - `actions/seedAssets.ts` (publique côté client, mais protégée par `SEED_ADMIN_TOKEN`)
    - `seedAssets({ ingredients[], meals[], mealIngredients[], assetsDataVersion?, adminToken })`

- Analytics (public)
  - `queries/analytics.ts`
    - `dailyActiveUsers(day)`
    - `dailyEventCounts(day)`
    - `topViewedAssets(kind, from, to, limit?)`
    - `listActiveUsersForRange(from, to)`
    - `listActiveUsersForDay(day)`
    - `latencyStats(eventType, from, to)`
  - `mutations/events.ts`
    - `trackEvent({ eventType, payload?, sessionId?, appVersion? })`

- Users (owner-only)
  - `queries/users.ts`
    - `getMe()`
    - `getUserPreferences()`
  - `mutations/users.ts`
    - `ensureUser({ appVersion?, platform?, locale?, displayName?, avatarUrl?, preferences? })`
    - `upsertUserPreferences({ preferences })`

- Plans & Entries (owner-only)
  - `queries/plans.ts`
    - `list()`
    - `getCurrent()`
    - `getDetails({ planId })`
  - `mutations/plans.ts`
    - `create({...})` (idempotent via `clientId`)
    - `update({ planId, ...fields })`
    - `setCurrent({ planId })`
    - `remove({ planId })` (cascade delete `plan_days` et `plan_entries`)
  - `queries/mealPlans.ts`
    - `listEntriesByDay({ day, planId? })`
    - `listEntriesByWeek({ startDay, endDay })`
    - `listByPlanDay({ planId, day, _ts? })`
  - `mutations/mealPlans.ts`
    - `addEntry({ day, slot, kind, refType, refKey, quantity, unit?, planId?, clientId?, idempotenceKey })` (fallback plan courant)
    - `updateEntry({ entryId, quantity, unit? })`
    - `removeEntry({ entryId })`

- Saved Meals (owner-only)
  - `queries/savedMeals.ts`
    - `list(page?, limit?)`
    - `isSaved({ refType, refKey })`
  - `mutations/savedMeals.ts`
    - `save({ refType, refKey, note? })`
    - `remove({ refType, refKey })`

- Custom Ingredients & Meals (owner-only)
  - `queries/customIngredients.ts`
    - `listMine(page?, limit?)`
    - `searchMine(q, page?, limit?)`
    - `getByClientId(clientId)`
  - `mutations/customIngredients.ts`
    - `upsert({ clientId, name, macrosPer100g, unit?, imageKey?, barcode?, source? })`
  - `queries/customMeals.ts`
    - `list(page?, limit?)`
  - `mutations/customMeals.ts`
    - `upsert({ clientId, name?, macrosPer100g, imageKey? })`

- Debug
  - `queries/debug.ts`
    - `whoami()` – utile pour diagnostiquer la configuration Clerk/Convex

---

## 5) Spécification Admin Dashboard (recommandée)

Pages principales:
- Catalogue Ingrédients (public)
  - Liste, recherche (préfixe sur nom normalisé), filtrage par tags
  - Détail: macros/100g, tags, synonyms, imageKey
  - i18n: `nameI18n.fr/en/ar`

- Catalogue Repas (public)
  - Liste, recherche, tags
  - Détail: i18n (nom + description), image, composition (via `meal_ingredients`)
  - Vue composition: table des ingrédients + quantités en g + méthode de cuisson

- Seed & Versionning
  - Upload JSON (ingredients[], meals[], mealIngredients[])
  - Exécuter `actions.seedAssets` avec `adminToken`
  - Afficher diffs: `created` / `updated` / durée, lire `meta.assetsDataVersion`

- Analytics
  - DAU par jour (`dailyActiveUsers`)
  - Compte par type d’événement (`dailyEventCounts`)
  - Top assets vus (`topViewedAssets(kind, from, to)`)
  - Latence par type (`latencyStats`)
  - Détail utilisateurs actifs d’un jour (`listActiveUsersForDay`)

- Support Utilisateur (lecture seule)
  - Recherche par `users.userId` (Clerk subject)
  - Afficher `users` doc + `preferences`
  - Lister `plans`, `plan_days`, `plan_entries` par date/plan
  - Lister `saved_meals`, `custom_*`

Rôles & ACL (proposition):
- `ADMIN` et `EDITOR`
  - `ADMIN`: accès seed + analytics + lecture user data
  - `EDITOR`: accès catalogue + seed
- Implémentations possibles:
  - Liste d’emails admin en env: `ADMIN_EMAILS=...` et garde côté Convex
  - Claim `role` dans le JWT Clerk; garde côté Convex (`ctx.auth.getUserIdentity()` → `identity.orgRole`/`identity.jwt`)

---

## 6) Exemples d’appel (client Convex)

TypeScript (Next.js Admin):
```ts
import { ConvexClient } from "convex/browser";
import { api } from "./convex/_generated/api"; // copier le client généré ou utiliser direct string ids

const client = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Liste des ingrédients
const { items, hasMore } = await client.query(api.queries.assets.listIngredients, { page: 1, limit: 50 });

// Seed (action) – REQUIERT ADMIN TOKEN
await client.action(api.actions.seedAssets.seedAssets, {
  ingredients: [...],
  meals: [...],
  mealIngredients: [...],
  assetsDataVersion: 2,
  adminToken: process.env.SEED_ADMIN_TOKEN,
});

// KPIs
const dau = await client.query(api.queries.analytics.dailyActiveUsers, { day: "2025-10-01" });
```

Note: les mutations `mutations/assets.*` sont internes (non exposées). Toute édition passe par `actions.seedAssets`.

---

## 7) Sécurité

- Auth Clerk requise pour toutes les données « owner-only ».
- Les queries Analytics et Assets sont publiques aujourd’hui (pas d’auth) – recommandation: ajouter une garde (ex: header apiKey, role admin, ou `SEED_ADMIN_TOKEN`/claim) si l’admin doit rester privé.
- Le seed est protégé par `SEED_ADMIN_TOKEN` (à diffuser uniquement aux admins).

---

## 8) Pré-requis Environnement (Admin)

- Variables côté Front Admin (Next/Remix):
  - `NEXT_PUBLIC_CONVEX_URL=https://fabulous-stork-993.convex.cloud`
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...` (si vous intégrez Clerk côté admin)

- Variables côté Convex (Dashboard → Environment Variables):
  - `CLERK_JWT_ISSUER_DOMAIN=https://sought-humpback-85.clerk.accounts.dev`
  - `SEED_ADMIN_TOKEN=...` (secret partagé pour seed)
  - Optionnel: `CLERK_ISSUER_URL` si vous utilisez un autre setup

---

## 9) Backlog/API à prévoir (si édition fine requise)

- Mutations publiques sécurisées pour CRUD direct d’un asset (ingredients/meals/meal_ingredients), avec garde Admin.
- Index additionnels pour pagination performante (par `createdAt`).
- Upload d’images (S3/GCS) et gestion `imageKey` côté Admin.
- Filtres server-side pour tags (au lieu d’un filtrage en mémoire).

---

## 10) Ressources code

- Schéma: `convex/schema.ts`
- Queries: `convex/queries/*`
- Mutations: `convex/mutations/*`
- Actions: `convex/actions/seedAssets.ts`
- Auth: `convex/auth.config.ts`
- UI Mobile (référence d’usage): `utils/services/*`, `components-new/`, `app/`

---

## 11) Annexes (i18n & Seeds)

- Champs i18n:
  - Ingrédients: `nameI18n` { fr, en?, ar? }
  - Repas: `nameI18n`, `descriptionI18n`
- Seeds: jeux JSON attendus par `actions/seedAssets.ts` (cf. types `IngredientSeed`, `MealSeed`, `MealIngredientSeed`).

