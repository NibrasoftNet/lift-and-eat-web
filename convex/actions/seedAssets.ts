// convex/actions/seedAssets.ts
// Action de seed idempotente pour insérer/mettre à jour les assets dans Convex.
// NOTE: Un action ne peut pas accéder à la DB directement. Elle orchestre des mutations.

'use node';

import { action } from '../_generated/server';
import { v } from 'convex/values';
import { internal } from '../_generated/api';

const IngredientSeed = v.object({
  slug: v.string(),
  name: v.string(),
  nameI18n: v.optional(
    v.object({
      fr: v.string(),
      en: v.optional(v.string()),
      ar: v.optional(v.string()),
    }),
  ),
  synonyms: v.array(v.string()),
  tags: v.array(v.string()),
  unit: v.string(),
  macrosPer100g: v.object({
    kcal: v.number(),
    protein: v.number(),
    carbs: v.number(),
    fat: v.number(),
  }),
  imageKey: v.optional(v.string()),
  source: v.string(),
  sourceVersion: v.number(),
  createdAt: v.optional(v.number()),
});

const MealSeed = v.object({
  slug: v.string(),
  name: v.string(),
  nameI18n: v.optional(
    v.object({
      fr: v.string(),
      en: v.optional(v.string()),
      ar: v.optional(v.string()),
    }),
  ),
  descriptionI18n: v.optional(
    v.object({
      fr: v.string(),
      en: v.optional(v.string()),
      ar: v.optional(v.string()),
    }),
  ),
  tags: v.array(v.string()),
  imageKey: v.optional(v.string()),
  source: v.string(),
  sourceVersion: v.number(),
  createdAt: v.optional(v.number()),
});

const MealIngredientSeed = v.object({
  mealSlug: v.string(),
  ingredientSlug: v.string(),
  quantityGr: v.number(),
  cookingMethod: v.optional(v.string()),
});

export const seedAssets = action({
  args: {
    ingredients: v.array(IngredientSeed),
    meals: v.array(MealSeed),
    mealIngredients: v.array(MealIngredientSeed),
    assetsDataVersion: v.optional(v.number()),
    adminToken: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { ingredients, meals, mealIngredients, assetsDataVersion, adminToken },
  ) => {
    // Minimal admin guard via Convex env var
    const expected = process.env.SEED_ADMIN_TOKEN;
    if (!expected || adminToken !== expected) {
      throw new Error('Unauthorized seed: invalid admin token');
    }

    const start = Date.now();
    let created = 0;
    let updated = 0;

    for (const ing of ingredients) {
      const res = await ctx.runMutation(
        internal.mutations.assets.upsertIngredient,
        { data: ing },
      );
      if (res.op === 'inserted') created++;
      else updated++;
    }

    for (const meal of meals) {
      const res = await ctx.runMutation(internal.mutations.assets.upsertMeal, {
        data: meal,
      });
      if (res.op === 'inserted') created++;
      else updated++;
    }

    for (const mi of mealIngredients) {
      const res = await ctx.runMutation(
        internal.mutations.assets.upsertMealIngredient,
        { data: mi },
      );
      if (res.op === 'inserted') created++;
      else updated++;
    }

    if (typeof assetsDataVersion === 'number') {
      await ctx.runMutation(internal.mutations.assets.setMetaKey, {
        key: 'assetsDataVersion',
        value: assetsDataVersion,
      });
    }

    const durationMs = Date.now() - start;
    return { created, updated, durationMs } as const;
  },
});
