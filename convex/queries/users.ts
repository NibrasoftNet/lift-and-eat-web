// convex/queries/users.ts
// Queries owner-only pour récupérer le profil utilisateur et les préférences

import { query } from '../_generated/server';

export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const rows = await ctx.db
      .query('users')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .collect();

    return rows[0] ?? null;
  },
});

export const getUserPreferences = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const rows = await ctx.db
      .query('users')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .collect();

    const doc = rows[0] ?? null;
    return doc?.preferences ?? null;
  },
});
