// convex/mutations/customIngredients.ts
// Owner-only custom ingredients (personal catalogue)

import { mutation } from '../_generated/server';
import { v } from 'convex/values';

export const upsert = mutation({
  args: {
    clientId: v.string(),
    name: v.string(),
    macrosPer100g: v.object({
      kcal: v.number(),
      protein: v.number(),
      carbs: v.number(),
      fat: v.number(),
    }),
    unit: v.optional(v.string()), // default 'g'
    imageKey: v.optional(v.string()),
    barcode: v.optional(v.string()),
    source: v.optional(v.string()), // e.g. 'off'
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');
    const userId = identity.subject;
    const now = Date.now();

    // Create table if not present in schema: custom_ingredients
    // Schema expected fields: userId, clientId, name, macrosPer100g, unit, imageKey, barcode, source, createdAt, updatedAt

    const existing = await ctx.db
      .query('custom_ingredients')
      .withIndex('by_user_clientId', (q) => q.eq('userId', userId).eq('clientId', args.clientId))
      .collect();

    if (existing[0]) {
      const doc = existing[0];
      await ctx.db.patch(doc._id, {
        name: args.name,
        macrosPer100g: args.macrosPer100g,
        unit: args.unit ?? 'g',
        imageKey: args.imageKey,
        barcode: args.barcode,
        source: args.source ?? 'off',
        updatedAt: now,
      });
      return { op: 'updated', id: doc._id } as const;
    }

    const id = await ctx.db.insert('custom_ingredients', {
      userId,
      clientId: args.clientId,
      name: args.name,
      macrosPer100g: args.macrosPer100g,
      unit: args.unit ?? 'g',
      imageKey: args.imageKey,
      barcode: args.barcode,
      source: args.source ?? 'off',
      createdAt: now,
      updatedAt: now,
    });
    return { op: 'inserted', id } as const;
  },
});
