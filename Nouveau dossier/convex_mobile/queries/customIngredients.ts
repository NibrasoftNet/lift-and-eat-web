// convex/queries/customIngredients.ts
// Owner-only reads for personal custom ingredients

import { query } from '../_generated/server';
import { v } from 'convex/values';

function normalizeDiacritics(input: string): string {
  try {
    return input
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  } catch {
    return input.toLowerCase();
  }
}

export const listMine = query({
  args: {
    page: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { page = 1, limit = 50 }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { items: [], total: 0, page, limit, hasMore: false };
    const userId = identity.subject;

    const all = await ctx.db
      .query('custom_ingredients')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();

    const start = (page - 1) * limit;
    const end = start + limit;
    const items = all.slice(start, end);
    return { items, total: all.length, page, limit, hasMore: end < all.length };
  },
});

export const searchMine = query({
  args: {
    q: v.string(),
    page: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { q, page = 1, limit = 50 }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { items: [], total: 0, page, limit, hasMore: false };
    const userId = identity.subject;

    const term = normalizeDiacritics(q);
    const all = await ctx.db
      .query('custom_ingredients')
      .withIndex('by_user', (q2) => q2.eq('userId', userId))
      .collect();

    // simple filter on normalized name
    const filtered = all.filter((it) => {
      const name = (it?.name || '') as string;
      return normalizeDiacritics(name).includes(term);
    });

    const start = (page - 1) * limit;
    const end = start + limit;
    const items = filtered.slice(start, end);
    return {
      items,
      total: filtered.length,
      page,
      limit,
      hasMore: end < filtered.length,
    };
  },
});

export const getByClientId = query({
  args: { clientId: v.string() },
  handler: async (ctx, { clientId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const userId = identity.subject;
    const rows = await ctx.db
      .query('custom_ingredients')
      .withIndex('by_user_clientId', (q) => q.eq('userId', userId).eq('clientId', clientId))
      .collect();
    return rows[0] ?? null;
  },
});
