import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Mutations internes pour insérer des données (utilisées par les actions)

export const insertIngredient = internalMutation({
  args: {
    slug: v.string(),
    name: v.string(),
    nameI18n: v.optional(v.object({
      fr: v.string(),
      en: v.optional(v.string()),
      ar: v.optional(v.string()),
    })),
    nameNormalized: v.string(),
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
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("ingredients", args);
  },
});

export const insertMeal = internalMutation({
  args: {
    slug: v.string(),
    name: v.string(),
    nameI18n: v.optional(v.object({
      fr: v.string(),
      en: v.optional(v.string()),
      ar: v.optional(v.string()),
    })),
    descriptionI18n: v.optional(v.object({
      fr: v.string(),
      en: v.optional(v.string()),
      ar: v.optional(v.string()),
    })),
    nameNormalized: v.string(),
    tags: v.array(v.string()),
    imageKey: v.optional(v.string()),
    source: v.string(),
    sourceVersion: v.number(),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("meals", args);
  },
});

export const insertMealIngredient = internalMutation({
  args: {
    mealSlug: v.string(),
    ingredientSlug: v.string(),
    quantityGr: v.number(),
    cookingMethod: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("meal_ingredients", args);
  },
});

export const insertEvent = internalMutation({
  args: {
    eventType: v.string(),
    ts: v.number(),
    anonymousId: v.string(),
    userId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    payload: v.any(),
    appVersion: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("events", args);
  },
});

export const insertSavedMeal = internalMutation({
  args: {
    userId: v.string(),
    refType: v.string(),
    refKey: v.string(),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("saved_meals", args);
  },
});
