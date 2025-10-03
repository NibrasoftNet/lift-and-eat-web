// convex/queries/assets.ts
// Queries de lecture pour assets (ingredients, meals)

import { query } from '../_generated/server';
import { v } from 'convex/values';

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
    // MVP: ordre arbitraire (pas d'index dedicated). Ajouter index par createdAt si besoin.
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
    q: v.string(),
    page: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { q, page = 1, limit = 20 }) => {
    const norm = normalizeDiacritics(q);
    const lower = norm;
    const upper = norm + '\uffff';

    // Prefix search via range on nameNormalized index
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
    // NOTE: Pas d'index par tag pour MVP — filtrage en mémoire (dataset seed limité)
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
    // MVP: ordre arbitraire (pas d'index dedicated). Ajouter index par createdAt si besoin.
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
    // NOTE: Pas d'index par tag pour MVP — filtrage en mémoire
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

// Retrieve meal composition to rebuild meals locally during seed hydration
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
