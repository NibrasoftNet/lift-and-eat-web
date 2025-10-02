# Dictionnaire de données — Convex (Lift & Eat)

Dernière mise à jour: 2025-10-02 11:37 (+01:00)

Ce document décrit les tables, champs, indexes et relations définis dans `convex/schema.ts`.

---

## Convention générale

- Timestamps: millisecondes (number) côté serveur.
- i18n: champs `nameI18n` et `descriptionI18n` sont des objets `{ fr: string; en?: string; ar?: string }`.
- Références logiques:
  - Assets (public): `ingredients.slug`, `meals.slug`.
  - Custom (owner-only): `custom_ingredients.clientId`, `custom_meals.clientId` (ID stable côté client).
  - `plan_entries.refType` et `refKey` pointent soit vers un seed (`refType='seed'` + `refKey=slug`), soit vers un custom (`refType='custom'` + `refKey=clientId`).

---

## Tables et Index

### ingredients (public)
Champs:
- `slug: string` (unique logique)
- `name: string`
- `nameI18n?: { fr: string; en?: string; ar?: string }`
- `nameNormalized: string` (nom normalisé NFD/sans diacritiques, lower)
- `synonyms: string[]`
- `tags: string[]`
- `unit: string` (ex: "g")
- `macrosPer100g: { kcal: number; protein: number; carbs: number; fat: number }`
- `imageKey?: string`
- `source: string`
- `sourceVersion: number`
- `createdAt: number`

Index:
- `by_slug(slug)`
- `by_nameNormalized(nameNormalized)`
- SearchIndex: `search_name(nameNormalized)`

### meals (public)
Champs:
- `slug: string`
- `name: string`
- `nameI18n?: {...}`
- `descriptionI18n?: {...}`
- `nameNormalized: string`
- `tags: string[]`
- `imageKey?: string`
- `source: string`
- `sourceVersion: number`
- `createdAt: number`

Index:
- `by_slug(slug)`
- `by_nameNormalized(nameNormalized)`
- SearchIndex: `search_name(nameNormalized)`

### meal_ingredients (public, composition des repas)
Champs:
- `mealSlug: string`
- `ingredientSlug: string`
- `quantityGr: number`
- `cookingMethod?: string`

Index:
- `by_mealSlug(mealSlug)`
- `by_ingredientSlug(ingredientSlug)`

### events (analytics/KPIs)
Champs:
- `eventType: string` (ex: `asset_view`, `search`, `app_open`, `plan_add_meal`)
- `ts: number`
- `anonymousId: string`
- `userId?: string`
- `sessionId?: string`
- `payload: any`
- `appVersion?: string`

Index:
- `by_type_ts(eventType, ts)`
- `by_userId(userId)`
- `by_anonymousId(anonymousId)`

### users (owner-only)
Champs:
- `userId: string` (Clerk subject)
- `createdAt: number`
- `updatedAt?: number`
- `locale?: string`
- `appVersion?: string`
- `platform?: string`
- `displayName?: string`
- `avatarUrl?: string`
- `preferences?: any`

Index:
- `by_userId(userId)`

### plans (owner-only)
Champs:
- `userId: string`
- `name: string`
- `goal?: string`
- `unit?: string` (kg|lbs|st)
- `initialWeight?: number`
- `targetWeight?: number`
- `calories?: number`
- `carbs?: number`
- `fat?: number`
- `protein?: number`
- `durationWeeks?: number`
- `startDate?: string` (YYYY-MM-DD)
- `current?: boolean`
- `completed?: boolean`
- `clientId?: string` (idempotence côté client)
- `createdAt: number`
- `updatedAt: number`

Index:
- `by_user(userId)`
- `by_user_current(userId, current)`
- `by_user_clientId(userId, clientId)`

### plan_days (owner-only)
Champs:
- `planId: Id<'plans'>`
- `date: string` (YYYY-MM-DD)
- `calories?: number`
- `carbs?: number`
- `fat?: number`
- `protein?: number`
- `createdAt: number`
- `updatedAt: number`

Index:
- `by_plan(planId)`
- `by_plan_date(planId, date)`

### plan_entries (owner-only)
Champs:
- `userId: string`
- `day: string` (YYYY-MM-DD)
- `slot: string`
- `kind: string` ('meal' | 'ingredient')
- `refType: string` ('seed' | 'custom')
- `refKey: string` (slug | clientId)
- `quantity: number`
- `unit?: string` (ex: 'g')
- `planId?: Id<'plans'>`
- `clientId?: string` (idempotence)
- `idempotenceKey: string`
- `createdAt: number`
- `updatedAt: number`

Index:
- `by_user_day(userId, day)`
- `by_user(userId)`
- `by_idem(userId, idempotenceKey)`
- `by_user_clientId(userId, clientId)`
- `by_user_plan_day(userId, planId, day)`
- `by_user_plan(userId, planId)`

### water_logs (owner-only)
Champs:
- `userId: string`
- `day: string` (YYYY-MM-DD)
- `ts: number`
- `ml: number`
- `source?: string`
- `deviceId?: string`

Index:
- `by_user_day(userId, day)`
- `by_user_ts(userId, ts)`

### saved_meals (owner-only)
Champs:
- `userId: string`
- `refType: string` ('seed'|'custom')
- `refKey: string`
- `note?: string`
- `createdAt: number`

Index:
- `by_user(userId)`
- `by_user_ref(userId, refType, refKey)`

### meta
Champs:
- `key: string` (ex: `assetsDataVersion`)
- `value: any`

Index:
- `by_key(key)`

### custom_ingredients (owner-only)
Champs:
- `userId: string`
- `clientId: string`
- `name?: string`
- `macrosPer100g: { kcal; protein; carbs; fat }`
- `unit?: string`
- `imageKey?: string`
- `barcode?: string`
- `source?: string`
- `createdAt: number`
- `updatedAt: number`

Index:
- `by_user_clientId(userId, clientId)`
- `by_user(userId)`

### custom_meals (owner-only)
Champs:
- `userId: string`
- `clientId: string`
- `name?: string`
- `macrosPer100g: { kcal; protein; carbs; fat }`
- `imageKey?: string`
- `createdAt: number`
- `updatedAt: number`

Index:
- `by_user_clientId(userId, clientId)`
- `by_user(userId)`

---

## Relations & Intégrité

- `meal_ingredients.mealSlug` → `meals.slug`
- `meal_ingredients.ingredientSlug` → `ingredients.slug`
- `plan_days.planId` → `plans._id`
- `plan_entries.planId` → `plans._id`
- `plan_entries.refType/refKey` →
  - seed: `ingredients.slug` ou `meals.slug` selon `kind`
  - custom: `custom_ingredients.clientId` ou `custom_meals.clientId`
- `saved_meals.refType/refKey` → même logique que ci-dessus

---

## Notes i18n

- Les seeds intègrent FR/EN/AR pour `ingredients.nameI18n`, `meals.nameI18n` et `meals.descriptionI18n`.
- L’admin peut afficher/éditer ces champs; l’édition s’effectue via l’action `seedAssets` (voir référence API).

---

## Améliorations futures (index/perf)

- Ajouter index par `createdAt` sur `ingredients`/`meals` pour pagination serveur.
- Ajouter index par `tags` (si besoin de filtrage server-side massif).
- Ajouter index range sur `plan_entries.day` par `userId`.
