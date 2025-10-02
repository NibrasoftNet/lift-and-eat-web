// convex/mutations/events.ts
// Mutation pour suivre les événements (KPIs)

import { mutation } from '../_generated/server';
import { v } from 'convex/values';

export const trackEvent = mutation({
  args: {
    eventType: v.string(),
    payload: v.optional(v.any()),
    sessionId: v.optional(v.string()),
    appVersion: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const ts = Date.now();

    const doc = {
      eventType: args.eventType,
      ts,
      anonymousId: identity?.tokenIdentifier ?? 'anonymous',
      userId: identity?.subject,
      sessionId: args.sessionId,
      payload: args.payload ?? {},
      appVersion: args.appVersion,
    } as const;

    const id = await ctx.db.insert('events', doc);
    return { id, ts };
  },
});
