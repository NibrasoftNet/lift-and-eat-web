# Référence API — Convex (Admin)

Dernière mise à jour: 2025-10-02 11:37 (+01:00)

Ce document liste les endpoints Convex exposés par la base de code actuelle, avec leurs arguments et retours attendus.

Notes:
- Les noms indiqués correspondent aux exports des fichiers `convex/queries/*.ts`, `convex/mutations/*.ts`, `convex/actions/*.ts`.
- Les mutations d'assets sont des `internalMutation` et ne sont PAS appelables directement depuis un client navigateur. Utilisez l'action `seedAssets`.
- L'auth est requise pour toutes les ressources « owner-only » (plans, entries, saved_meals, custom_*). Les assets et analytics sont publics par défaut.

---

## Actions

### actions.seedAssets.seedAssets
- Fichier: `convex/actions/seedAssets.ts`
- Args:
  - `ingredients: IngredientSeed[]`
  - `meals: MealSeed[]`
  - `mealIngredients: MealIngredientSeed[]`
  - `assetsDataVersion?: number`
  - `adminToken?: string` (obligatoire si `SEED_ADMIN_TOKEN` est configuré côté Convex)
- Retour:
  - `{ created: number; updated: number; durationMs: number }`
- Description: Orchestration de seed idempotente pour `ingredients`, `meals`, `meal_ingredients` + mise à jour de `meta.assetsDataVersion`.

Types attendus:
```ts
// IngredientSeed
{
  slug: string;
  name: string;
  nameI18n?: { fr: string; en?: string; ar?: string };
  synonyms: string[];
  tags: string[];
  unit: string; // e.g. 'g'
  macrosPer100g: { kcal: number; protein: number; carbs: number; fat: number };
  imageKey?: string;
  source: string;
  sourceVersion: number;
  createdAt?: number; // ms
}

// MealSeed
{
  slug: string;
  name: string;
  nameI18n?: { fr: string; en?: string; ar?: string };
  descriptionI18n?: { fr: string; en?: string; ar?: string };
  tags: string[];
  imageKey?: string;
  source: string;
  sourceVersion: number;
  createdAt?: number;
}

// MealIngredientSeed
{
  mealSlug: string;
  ingredientSlug: string;
  quantityGr: number;
  cookingMethod?: string;
}
```

---

## Assets (public)

- `queries.assets.getIngredientBySlug({ slug: string })`
  - Retour: `Ingredient | null`
- `queries.assets.listIngredients({ page?: number; limit?: number })`
  - Retour: `{ items: Ingredient[]; page; limit; total; hasMore }`
- `queries.assets.searchIngredients({ q: string; page?: number; limit?: number })`
  - Retour: `{ items: Ingredient[]; page; limit; total; hasMore }`
- `queries.assets.listIngredientsByTag({ tag: string; page?: number; limit?: number })`
  - Retour: `{ items: Ingredient[]; page; limit; total; hasMore }`
- `queries.assets.getMealBySlug({ slug: string })`
  - Retour: `Meal | null`
- `queries.assets.listMeals({ page?: number; limit?: number })`
  - Retour: `{ items: Meal[]; page; limit; total; hasMore }`
- `queries.assets.listMealsByTag({ tag: string; page?: number; limit?: number })`
  - Retour: `{ items: Meal[]; page; limit; total; hasMore }`
- `queries.assets.getMealIngredientsBySlug({ slug: string })`
  - Retour: `MealIngredient[]`

Mutations internes (non exposées au client):
- `internal.mutations.assets.upsertIngredient({ data: IngredientSeed })`
- `internal.mutations.assets.upsertMeal({ data: MealSeed })`
- `internal.mutations.assets.upsertMealIngredient({ data: MealIngredientSeed })`
- `internal.mutations.assets.setMetaKey({ key: string; value: any })`

---

## Analytics (public)

- `queries.analytics.dailyActiveUsers({ day: string /* YYYY-MM-DD */ })`
  - Retour: `{ day, dau }`
- `queries.analytics.dailyEventCounts({ day: string })`
  - Retour: `{ day, items: Array<{ eventType: string; count: number }> }`
- `queries.analytics.topViewedAssets({ kind: 'ingredient'|'meal', from: string, to: string, limit?: number })`
  - Retour: `{ kind, from, to, items: Array<{ slug: string; count: number }> }`
- `queries.analytics.listActiveUsersForRange({ from: string, to: string })`
  - Retour: `{ from, to, days: Array<{ day: string; dau: number; items: Array<{ id: string; userId?: string; anonymousId?: string; user?: any }> }> }`
- `queries.analytics.listActiveUsersForDay({ day: string })`
  - Retour: `{ day, total: number, items: Array<{ id: string; userId?: string; anonymousId?: string; user?: any }> }`
- `queries.analytics.latencyStats({ eventType: string, from: string, to: string })`
  - Retour: `{ eventType, from, to, count, p50, p95, p99, avg, min, max }`

- `mutations.events.trackEvent({ eventType: string, payload?: any, sessionId?: string, appVersion?: string })`
  - Retour: `{ id: Id<'events'>, ts: number }`

---

## Users (owner-only)

- `queries.users.getMe()`
  - Retour: `User | null`
- `queries.users.getUserPreferences()`
  - Retour: `any | null`
- `mutations.users.ensureUser({ appVersion?, platform?, locale?, displayName?, avatarUrl?, preferences? })`
  - Retour: `{ id, created: boolean }`
- `mutations.users.upsertUserPreferences({ preferences: any })`
  - Retour: `{ updated: boolean; created: boolean; id?: Id<'users'> }`

---

## Plans (owner-only)

- `queries.plans.list()`
  - Retour: `Plan[]`
- `queries.plans.getCurrent()`
  - Retour: `Plan | null`
- `queries.plans.getDetails({ planId: Id<'plans'> })`
  - Retour: `{ plan: Plan; days: PlanDay[] }`

- `mutations.plans.create({ name, goal?, unit?, initialWeight?, targetWeight?, calories?, carbs?, fat?, protein?, durationWeeks?, startDate?, current?, completed?, clientId? })`
  - Retour: `{ id: Id<'plans'>, reused: boolean }`
- `mutations.plans.update({ planId, ...fields })`
  - Retour: `{ id: Id<'plans'> }`
- `mutations.plans.setCurrent({ planId })`
  - Retour: `{ id: Id<'plans'> }`
- `mutations.plans.remove({ planId })`
  - Retour: `{ removed: true }`

---

## Plan Entries (owner-only)

- `queries.mealPlans.listEntriesByDay({ day: string, planId?: Id<'plans'> })`
  - Retour: `{ items: PlanEntry[] }`
- `queries.mealPlans.listEntriesByWeek({ startDay: string, endDay: string })`
  - Retour: `{ items: PlanEntry[] }`
- `queries.mealPlans.listByPlanDay({ planId: Id<'plans'>, day: string, _ts?: number })`
  - Retour: `{ items: PlanEntry[], _ts?: number }`

- `mutations.mealPlans.addEntry({ day, slot, kind, refType, refKey, quantity, unit?, planId?, clientId?, idempotenceKey })`
  - Retour: `{ id: Id<'plan_entries'>, reused: boolean }`
- `mutations.mealPlans.updateEntry({ entryId: Id<'plan_entries'>, quantity: number, unit?: string })`
  - Retour: `{ id: Id<'plan_entries'> }`
- `mutations.mealPlans.removeEntry({ entryId: Id<'plan_entries'> })`
  - Retour: `{ removed: true }`

---

## Saved Meals (owner-only)

- `queries.savedMeals.list({ page?: number, limit?: number })`
  - Retour: `{ items: SavedMeal[]; page; limit; total; hasMore }`
- `queries.savedMeals.isSaved({ refType: string, refKey: string })`
  - Retour: `{ saved: boolean }`
- `mutations.savedMeals.save({ refType: 'seed'|'custom'|'local', refKey: string, note?: string })`
  - Retour: `{ created: boolean; updated: boolean }`
- `mutations.savedMeals.remove({ refType: string, refKey: string })`
  - Retour: `{ removed: boolean }`

---

## Custom Ingredients (owner-only)

- `queries.customIngredients.listMine({ page?: number, limit?: number })`
  - Retour: `{ items: CustomIngredient[]; total; page; limit; hasMore }`
- `queries.customIngredients.searchMine({ q: string, page?: number, limit?: number })`
  - Retour: `{ items: CustomIngredient[]; total; page; limit; hasMore }`
- `queries.customIngredients.getByClientId({ clientId: string })`
  - Retour: `CustomIngredient | null`

- `mutations.customIngredients.upsert({ clientId: string, name: string, macrosPer100g: { kcal; protein; carbs; fat }, unit?: string, imageKey?: string, barcode?: string, source?: string })`
  - Retour: `{ op: 'inserted'|'updated', id: Id<'custom_ingredients'> }`

---

## Custom Meals (owner-only)

- `queries.customMeals.list({ page?: number, limit?: number })`
  - Retour: `{ items: CustomMeal[]; page; limit; total; hasMore }`
- `mutations.customMeals.upsert({ clientId: string, name?: string, macrosPer100g: { kcal; protein; carbs; fat }, imageKey?: string })`
  - Retour: `{ created: boolean; updated: boolean; id?: Id<'custom_meals'> }`

---

## Debug

- `queries.debug.whoami()`
  - Retour: `{ identity, envIssuerDomain, envIssuerUrl, hasIdentity }`

---

## Types simplifiés (extraits du schéma)

```ts
// Ingredient (public)
interface Ingredient {
  _id: string; slug: string; name: string;
  nameI18n?: { fr: string; en?: string; ar?: string };
  nameNormalized: string; synonyms: string[]; tags: string[];
  unit: string; macrosPer100g: { kcal: number; protein: number; carbs: number; fat: number };
  imageKey?: string; source: string; sourceVersion: number; createdAt: number;
}

// Meal (public)
interface Meal {
  _id: string; slug: string; name: string;
  nameI18n?: { fr: string; en?: string; ar?: string };
  descriptionI18n?: { fr: string; en?: string; ar?: string };
  nameNormalized: string; tags: string[]; imageKey?: string;
  source: string; sourceVersion: number; createdAt: number;
}

// MealIngredient (public)
interface MealIngredient {
  _id: string; mealSlug: string; ingredientSlug: string; quantityGr: number; cookingMethod?: string;
}

// User (owner-only)
interface UserDoc {
  _id: string; userId: string; createdAt: number; updatedAt?: number;
  locale?: string; appVersion?: string; platform?: string;
  displayName?: string; avatarUrl?: string; preferences?: any;
}

// Plan/PlanDay/PlanEntry (owner-only)
interface Plan { _id: string; userId: string; name: string; current?: boolean; completed?: boolean; clientId?: string; createdAt: number; updatedAt: number; /* ... */ }
interface PlanDay { _id: string; planId: string; date: string; createdAt: number; updatedAt: number; /* ... */ }
interface PlanEntry { _id: string; userId: string; day: string; slot: string; kind: string; refType: string; refKey: string; quantity: number; unit?: string; planId?: string; clientId?: string; idempotenceKey: string; createdAt: number; updatedAt: number; }

// SavedMeal (owner-only)
interface SavedMeal { _id: string; userId: string; refType: string; refKey: string; note?: string; createdAt: number; }

// CustomIngredient / CustomMeal (owner-only)
interface CustomIngredient { _id: string; userId: string; clientId: string; name?: string; macrosPer100g: { ... }; unit?: string; imageKey?: string; barcode?: string; source?: string; createdAt: number; updatedAt: number; }
interface CustomMeal { _id: string; userId: string; clientId: string; name?: string; macrosPer100g: { ... }; imageKey?: string; createdAt: number; updatedAt: number; }
```
