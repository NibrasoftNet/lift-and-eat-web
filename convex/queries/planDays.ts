import { v } from 'convex/values';
import { query } from '../_generated/server';

export const getDailyPlanForDate = query({
  args: {
    planId: v.id('plans'),
    date: v.string(),
  },
  handler: async (ctx, { planId, date }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const userId = identity.subject;

    // Vérifier que le plan appartient à l'utilisateur
    const plan = await ctx.db.get(planId);
    if (!plan || plan.userId !== userId) return null;

    // Récupérer toutes les entrées pour ce plan et cette date
    const entries = await ctx.db
      .query('plan_entries')
      .withIndex('by_user_plan_day', (q) => 
        q.eq('userId', userId).eq('planId', planId).eq('day', date)
      )
      .collect();

    return {
      planId,
      date,
      items: entries,
    };
  },
});

export const getEntriesBySlot = query({
  args: {
    planId: v.id('plans'),
    date: v.string(),
    slot: v.string(),
  },
  handler: async (ctx, { planId, date, slot }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const userId = identity.subject;

    // Vérifier que le plan appartient à l'utilisateur
    const plan = await ctx.db.get(planId);
    if (!plan || plan.userId !== userId) return [];

    // Récupérer les entrées pour ce plan, date et slot
    const entries = await ctx.db
      .query('plan_entries')
      .withIndex('by_user_plan_day', (q) => 
        q.eq('userId', userId).eq('planId', planId).eq('day', date)
      )
      .filter((q) => q.eq(q.field('slot'), slot.toLowerCase()))
      .collect();

    return entries;
  },
});
