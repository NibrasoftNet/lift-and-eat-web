// Queries synchronisées avec l'app mobile pour lecture des assets
import { query } from "./_generated/server";
import { v } from "convex/values";

function normalizeDiacritics(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export const getIngredientBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const rows = await ctx.db
      .query('ingredients')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .collect();
    return rows[0] ?? null;
  },
});

export const listIngredients = query({
  args: {
    page: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { page = 1, limit = 20 }) => {
    const all = await ctx.db.query('ingredients').collect();
    const start = (page - 1) * limit;
    const end = start + limit;
    const items = all.slice(start, end);
    return {
      items,
      page,
      limit,
      total: all.length,
      hasMore: end < all.length,
    };
  },
});

export const searchIngredients = query({
  args: {
    query: v.string(),
    page: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { query: q, page = 1, limit = 20 }) => {
    const norm = normalizeDiacritics(q);
    const lower = norm;
    const upper = norm + '\uffff';

    const all = await ctx.db
      .query('ingredients')
      .withIndex('by_nameNormalized', (iq) =>
        iq.gte('nameNormalized', lower).lt('nameNormalized', upper),
      )
      .collect();

    const start = (page - 1) * limit;
    const end = start + limit;
    const items = all.slice(start, end);
    return {
      items,
      page,
      limit,
      total: all.length,
      hasMore: end < all.length,
    };
  },
});

export const listIngredientsByTag = query({
  args: {
    tag: v.string(),
    page: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { tag, page = 1, limit = 20 }) => {
    const all = await ctx.db.query('ingredients').collect();
    const filtered = all.filter((i) => i.tags?.includes(tag));

    const start = (page - 1) * limit;
    const end = start + limit;
    const items = filtered.slice(start, end);
    return {
      items,
      page,
      limit,
      total: filtered.length,
      hasMore: end < filtered.length,
    };
  },
});

export const getMealBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const rows = await ctx.db
      .query('meals')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .collect();
    return rows[0] ?? null;
  },
});

export const listMeals = query({
  args: {
    page: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { page = 1, limit = 20 }) => {
    const all = await ctx.db.query('meals').collect();
    const start = (page - 1) * limit;
    const end = start + limit;
    const items = all.slice(start, end);
    return {
      items,
      page,
      limit,
      total: all.length,
      hasMore: end < all.length,
    };
  },
});

export const listMealsByTag = query({
  args: {
    tag: v.string(),
    page: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { tag, page = 1, limit = 20 }) => {
    const all = await ctx.db.query('meals').collect();
    const filtered = all.filter((m) => m.tags?.includes(tag));

    const start = (page - 1) * limit;
    const end = start + limit;
    const items = filtered.slice(start, end);
    return {
      items,
      page,
      limit,
      total: filtered.length,
      hasMore: end < filtered.length,
    };
  },
});

export const searchMeals = query({
  args: {
    query: v.string(),
    page: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { query: q, page = 1, limit = 20 }) => {
    const norm = normalizeDiacritics(q);
    const lower = norm;
    const upper = norm + '\uffff';

    const all = await ctx.db
      .query('meals')
      .withIndex('by_nameNormalized', (iq) =>
        iq.gte('nameNormalized', lower).lt('nameNormalized', upper),
      )
      .collect();

    const start = (page - 1) * limit;
    const end = start + limit;
    const items = all.slice(start, end);
    return {
      items,
      page,
      limit,
      total: all.length,
      hasMore: end < all.length,
    };
  },
});

// Retrieve meal composition
export const getMealIngredientsBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const rows = await ctx.db
      .query('meal_ingredients')
      .withIndex('by_mealSlug', (q) => q.eq('mealSlug', slug))
      .collect();
    return rows;
  },
});

// Récupérer la version actuelle des assets depuis la table meta
export const getAssetsVersion = query({
  args: {},
  handler: async (ctx) => {
    const meta = await ctx.db
      .query("meta")
      .withIndex("by_key", (q) => q.eq("key", "assetsDataVersion"))
      .first();

    return { version: meta?.value ?? 0 };
  },
});

// Compter les ingrédients
export const countIngredients = query({
  args: {},
  handler: async (ctx) => {
    const total = (await ctx.db.query("ingredients").collect()).length;
    return { count: total };
  },
});

// Compter les repas
export const countMeals = query({
  args: {},
  handler: async (ctx) => {
    const total = (await ctx.db.query("meals").collect()).length;
    return { count: total };
  },
});
