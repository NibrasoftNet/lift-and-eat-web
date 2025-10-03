// convex/queries/savedMeals.ts
// Owner-only saved meals listing

import { query } from '../_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: {
    page: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { page = 1, limit = 100 }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');
    const userId = identity.subject;

    const all = await ctx.db
      .query('saved_meals')
      .withIndex('by_user', (q) => q.eq('userId', userId))
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
    } as const;
  },
});

export const isSaved = query({
  args: {
    refType: v.string(),
    refKey: v.string(),
  },
  handler: async (ctx, { refType, refKey }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');
    const userId = identity.subject;

    const rows = await ctx.db
      .query('saved_meals')
      .withIndex('by_user_ref', (q) =>
        q.eq('userId', userId).eq('refType', refType).eq('refKey', refKey),
      )
      .collect();

    return { saved: rows.length > 0 } as const;
  },
});
