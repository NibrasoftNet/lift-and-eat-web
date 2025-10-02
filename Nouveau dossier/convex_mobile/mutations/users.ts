// convex/mutations/users.ts
// Ensure a user document exists and is up-to-date for the current authenticated user.

import { mutation } from '../_generated/server';
import { v } from 'convex/values';

export const ensureUser = mutation({
  args: {
    appVersion: v.optional(v.string()),
    platform: v.optional(v.string()),
    locale: v.optional(v.string()),
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    preferences: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');
    const userId = identity.subject;

    const rows = await ctx.db
      .query('users')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .collect();

    const now = Date.now();

    if (rows.length > 0) {
      const doc = rows[0];
      await ctx.db.patch(doc._id, {
        updatedAt: now,
        appVersion: args.appVersion ?? doc.appVersion,
        platform: args.platform ?? doc.platform,
        locale: args.locale ?? doc.locale,
        displayName: args.displayName ?? doc.displayName,
        avatarUrl: args.avatarUrl ?? doc.avatarUrl,
        preferences: args.preferences ?? doc.preferences,
      });
      return { id: doc._id, created: false } as const;
    }

    const id = await ctx.db.insert('users', {
      userId,
      createdAt: now,
      updatedAt: now,
      appVersion: args.appVersion,
      platform: args.platform,
      locale: args.locale,
      displayName: args.displayName,
      avatarUrl: args.avatarUrl,
      preferences: args.preferences,
    });

    return { id, created: true } as const;
  },
});

export const upsertUserPreferences = mutation({
  args: {
    preferences: v.any(),
  },
  handler: async (ctx, { preferences }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');
    const userId = identity.subject;

    const rows = await ctx.db
      .query('users')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .collect();

    const now = Date.now();
    if (rows.length > 0) {
      const doc = rows[0] as any;
      const prev: any = doc.preferences ?? {};
      // Shallow merge + deep merge for nutritionGoals
      const merged: any = {
        ...prev,
        ...preferences,
      };
      if (prev?.nutritionGoals || preferences?.nutritionGoals) {
        merged.nutritionGoals = {
          ...(prev?.nutritionGoals ?? {}),
          ...(preferences?.nutritionGoals ?? {}),
        };
      }
      await ctx.db.patch(doc._id, {
        updatedAt: now,
        preferences: merged,
      });
      return { updated: true, created: false } as const;
    }

    const id = await ctx.db.insert('users', {
      userId,
      createdAt: now,
      updatedAt: now,
      preferences,
    });
    return { updated: false, created: true, id } as const;
  },
});
