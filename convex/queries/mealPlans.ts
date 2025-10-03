// convex/queries/mealPlans.ts
import { query } from '../_generated/server';
import { v } from 'convex/values';

export const listEntriesByDay = query({
  args: {
    day: v.string(), // YYYY-MM-DD
    planId: v.optional(v.id('plans')),
  },
  handler: async (ctx, { day, planId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');
    const userId = identity.subject;

    const entries = planId
      ? await ctx.db
          .query('plan_entries')
          .withIndex('by_user_plan_day', (q) =>
            q.eq('userId', userId).eq('planId', planId).eq('day', day),
          )
          .collect()
      : await ctx.db
          .query('plan_entries')
          .withIndex('by_user_day', (q) => q.eq('userId', userId).eq('day', day))
          .collect();

    return { items: entries };
  },
});

export const listEntriesByWeek = query({
  args: {
    startDay: v.string(), // YYYY-MM-DD (monday)
    endDay: v.string(),   // YYYY-MM-DD (sunday)
  },
  handler: async (ctx, { startDay, endDay }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');
    const userId = identity.subject;

    // NOTE: No range index on day; simple scan by_user then filter in memory (MVP)
    const all = await ctx.db
      .query('plan_entries')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();

    const items = all.filter((e) => e.day >= startDay && e.day <= endDay);
    return { items };
  },
});

export const listByPlanDay = query({
  args: {
    planId: v.id('plans'),
    day: v.string(),
    // Paramètre optionnel pour forcer le bypass du cache
    _ts: v.optional(v.number()),
  },
  handler: async (ctx, { planId, day, _ts }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');
    const userId = identity.subject;

    const entries = await ctx.db
      .query('plan_entries')
      .withIndex('by_user_plan_day', (q) =>
        q.eq('userId', userId).eq('planId', planId).eq('day', day),
      )
      .collect();

    // Le paramètre _ts force Convex à traiter cette query comme unique
    return { items: entries, _ts };
  },
});
