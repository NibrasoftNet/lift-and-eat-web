// convex/mutations/assets.ts
// Mutations d'upsert pour assets et meta

import { internalMutation } from '../_generated/server';
import { v } from 'convex/values';

function normalizeDiacritics(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

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

export const upsertIngredient = internalMutation({
  args: { data: IngredientSeed },
  handler: async (ctx, { data }) => {
    const existing = await ctx.db
      .query('ingredients')
      .withIndex('by_slug', (q) => q.eq('slug', data.slug))
      .collect();
    const baseName = data.nameI18n?.fr ?? data.name;
    const nameNormalized = normalizeDiacritics(baseName);

    if (existing[0]) {
      const doc = existing[0];
      await ctx.db.patch(doc._id, {
        name: data.name,
        nameI18n: data.nameI18n,
        nameNormalized,
        synonyms: data.synonyms,
        tags: data.tags,
        unit: data.unit,
        macrosPer100g: data.macrosPer100g,
        imageKey: data.imageKey,
        source: data.source,
        sourceVersion: data.sourceVersion,
      });
      return { op: 'updated', id: doc._id } as const;
    } else {
      const id = await ctx.db.insert('ingredients', {
        slug: data.slug,
        name: data.name,
        nameI18n: data.nameI18n,
        nameNormalized,
        synonyms: data.synonyms,
        tags: data.tags,
        unit: data.unit,
        macrosPer100g: data.macrosPer100g,
        imageKey: data.imageKey,
        source: data.source,
        sourceVersion: data.sourceVersion,
        createdAt: data.createdAt ?? Date.now(),
      });
      return { op: 'inserted', id } as const;
    }
  },
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

export const upsertMeal = internalMutation({
  args: { data: MealSeed },
  handler: async (ctx, { data }) => {
    const existing = await ctx.db
      .query('meals')
      .withIndex('by_slug', (q) => q.eq('slug', data.slug))
      .collect();
    const baseName = data.nameI18n?.fr ?? data.name;
    const nameNormalized = normalizeDiacritics(baseName);

    if (existing[0]) {
      const doc = existing[0];
      await ctx.db.patch(doc._id, {
        name: data.name,
        nameI18n: data.nameI18n,
        descriptionI18n: data.descriptionI18n,
        nameNormalized,
        tags: data.tags,
        imageKey: data.imageKey,
        source: data.source,
        sourceVersion: data.sourceVersion,
      });
      return { op: 'updated', id: doc._id } as const;
    } else {
      const id = await ctx.db.insert('meals', {
        slug: data.slug,
        name: data.name,
        nameI18n: data.nameI18n,
        descriptionI18n: data.descriptionI18n,
        nameNormalized,
        tags: data.tags,
        imageKey: data.imageKey,
        source: data.source,
        sourceVersion: data.sourceVersion,
        createdAt: data.createdAt ?? Date.now(),
      });
      return { op: 'inserted', id } as const;
    }
  },
});

const MealIngredientSeed = v.object({
  mealSlug: v.string(),
  ingredientSlug: v.string(),
  quantityGr: v.number(),
  cookingMethod: v.optional(v.string()),
});

export const upsertMealIngredient = internalMutation({
  args: { data: MealIngredientSeed },
  handler: async (ctx, { data }) => {
    // Idempotence par (mealSlug, ingredientSlug)
    const list = await ctx.db
      .query('meal_ingredients')
      .withIndex('by_mealSlug', (q) => q.eq('mealSlug', data.mealSlug))
      .collect();
    const existing = list.find(
      (mi) => mi.ingredientSlug === data.ingredientSlug,
    );

    if (existing) {
      await ctx.db.patch(existing._id, {
        quantityGr: data.quantityGr,
        cookingMethod: data.cookingMethod,
      });
      return { op: 'updated', id: existing._id } as const;
    } else {
      const id = await ctx.db.insert('meal_ingredients', {
        mealSlug: data.mealSlug,
        ingredientSlug: data.ingredientSlug,
        quantityGr: data.quantityGr,
        cookingMethod: data.cookingMethod,
      });
      return { op: 'inserted', id } as const;
    }
  },
});

export const setMetaKey = internalMutation({
  args: { key: v.string(), value: v.any() },
  handler: async (ctx, { key, value }) => {
    const rows = await ctx.db
      .query('meta')
      .withIndex('by_key', (q) => q.eq('key', key))
      .collect();
    if (rows[0]) {
      await ctx.db.patch(rows[0]._id, { value });
      return { op: 'updated', id: rows[0]._id } as const;
    } else {
      const id = await ctx.db.insert('meta', { key, value });
      return { op: 'inserted', id } as const;
    }
  },
});
