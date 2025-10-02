// convex/mutations/mealPlans.ts
// Mutations owner-only pour gérer les entrées du plan journalier (meals & ingredients)

import { mutation } from '../_generated/server';
import { v } from 'convex/values';

export const addEntry = mutation({
  args: {
    day: v.string(), // YYYY-MM-DD
    slot: v.string(), // breakfast|lunch|dinner|...
    kind: v.string(), // 'meal' | 'ingredient'
    refType: v.string(), // 'seed' | 'custom'
    refKey: v.string(), // seed: slug; custom: clientId
    quantity: v.number(),
    unit: v.optional(v.string()), // 'g' etc.
    planId: v.optional(v.id('plans')),
    clientId: v.optional(v.string()),
    idempotenceKey: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');
    const userId = identity.subject;

    // FALLBACK: Si planId n'est pas fourni, essayer de récupérer le plan courant
    let finalPlanId = args.planId;
    if (!finalPlanId) {
      const currentPlan = await ctx.db
        .query('plans')
        .withIndex('by_user_current', q => 
          q.eq('userId', userId).eq('current', true)
        )
        .first();
      if (currentPlan) {
        finalPlanId = currentPlan._id;
        console.log(`[Fallback] Using current plan ${finalPlanId} for entry`);
      }
    }

    // Client-provided idempotence (preferred if present)
    if (args.clientId) {
      const existingByClient = await ctx.db
        .query('plan_entries')
        .withIndex('by_user_clientId', (q) =>
          q.eq('userId', userId).eq('clientId', args.clientId!),
        )
        .collect();
      if (existingByClient.length > 0) {
        const entry = existingByClient[0];
        await ctx.db.patch(entry._id, { updatedAt: Date.now() });
        return { id: entry._id, reused: true } as const;
      }
    }

    // Idempotence: check if an entry with this key already exists for this user
    const existing = await ctx.db
      .query('plan_entries')
      .withIndex('by_idem', (q) =>
        q.eq('userId', userId).eq('idempotenceKey', args.idempotenceKey),
      )
      .collect();

    const now = Date.now();

    // Ensure a plan_days row exists for this (planId, day) scope to keep days materialized
    if (finalPlanId) {
      const existingDay = await ctx.db
        .query('plan_days')
        .withIndex('by_plan_date', (q) => q.eq('planId', finalPlanId!).eq('date', args.day))
        .collect();
      if (existingDay.length > 0) {
        await ctx.db.patch(existingDay[0]._id, { updatedAt: now });
      } else {
        await ctx.db.insert('plan_days', {
          planId: finalPlanId!,
          date: args.day,
          createdAt: now,
          updatedAt: now,
        });
      }
    }
    if (existing.length > 0) {
      const entry = existing[0];
      // Refresh updatedAt and return existing id
      await ctx.db.patch(entry._id, { updatedAt: now });
      return { id: entry._id, reused: true } as const;
    }

    const id = await ctx.db.insert('plan_entries', {
      userId,
      day: args.day,
      slot: String(args.slot).toLowerCase(),
      kind: args.kind,
      refType: args.refType,
      refKey: args.refKey,
      quantity: args.quantity,
      unit: args.unit,
      planId: finalPlanId, // Utiliser le planId avec fallback
      clientId: args.clientId,
      idempotenceKey: args.idempotenceKey,
      createdAt: now,
      updatedAt: now,
    });

    return { id, reused: false } as const;
  },
});

export const updateEntry = mutation({
  args: {
    entryId: v.id('plan_entries'),
    quantity: v.number(),
    unit: v.optional(v.string()),
  },
  handler: async (ctx, { entryId, quantity, unit }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');
    const userId = identity.subject;

    const entry = await ctx.db.get(entryId);
    if (!entry) throw new Error('Not found');
    if (entry.userId !== userId) throw new Error('Forbidden');

    await ctx.db.patch(entryId, {
      quantity,
      ...(unit ? { unit } : {}),
      updatedAt: Date.now(),
    });
    return { id: entryId } as const;
  },
});

export const removeEntry = mutation({
  args: {
    entryId: v.id('plan_entries'),
  },
  handler: async (ctx, { entryId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');
    const userId = identity.subject;
    console.log('[Convex][mealPlans.removeEntry] start', { userId, entryId });

    const entry = await ctx.db.get(entryId);
    if (!entry) {
      console.log('[Convex][mealPlans.removeEntry] entry not found', { entryId });
      return { removed: false } as const;
    }
    console.log('[Convex][mealPlans.removeEntry] fetched entry', {
      entryId,
      entry: {
        userId: entry.userId,
        day: entry.day,
        slot: entry.slot,
        kind: entry.kind,
        refType: entry.refType,
        refKey: entry.refKey,
        planId: entry.planId,
      },
    });
    if (entry.userId !== userId) throw new Error('Forbidden');

    console.log('[Convex][mealPlans.removeEntry] deleting', { entryId });
    await ctx.db.delete(entryId);
    console.log('[Convex][mealPlans.removeEntry] done', { removed: true, entryId });
    return { removed: true } as const;
  },
});
