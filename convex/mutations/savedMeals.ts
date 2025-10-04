// convex/mutations/savedMeals.ts
// Owner-only saved meals (favorites/shortcuts)

import { mutation } from '../_generated/server';
import { v } from 'convex/values';

export const save = mutation({
  args: {
    refType: v.string(), // 'seed' | 'custom' | 'local'
    refKey: v.string(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, { refType, refKey, note }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');
    const userId = identity.subject;

    const existing = await ctx.db
      .query('saved_meals')
      .withIndex('by_user_ref', (q) =>
        q.eq('userId', userId).eq('refType', refType).eq('refKey', refKey),
      )
      .collect();

    const now = Date.now();
    if (existing.length > 0) {
      const row = existing[0];
      await ctx.db.patch(row._id, {
        note: note ?? row.note,
      });
      return { created: false, updated: true } as const;
    }

    await ctx.db.insert('saved_meals', {
      userId,
      refType,
      refKey,
      note,
      createdAt: now,
    });
    return { created: true, updated: false } as const;
  },
});

export const remove = mutation({
  args: {
    refType: v.string(), // 'seed' | 'custom' | 'local'
    refKey: v.string(),
  },
  handler: async (ctx, { refType, refKey }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');
    const userId = identity.subject;

    const existing = await ctx.db
      .query('saved_meals')
      .withIndex('by_user_ref', (q) =>
        q.eq('userId', userId).eq('refType', refType).eq('refKey', refKey),
      )
      .collect();

    if (existing.length === 0) return { removed: false } as const;

    await ctx.db.delete(existing[0]._id);
    return { removed: true } as const;
  },
});
