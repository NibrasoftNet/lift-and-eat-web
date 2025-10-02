// convex/queries/analytics.ts
import { query } from "../_generated/server";
import { v } from "convex/values";

// Return count of distinct users who opened the app on a given day (YYYY-MM-DD)
// Uses events documents written by mutations/events.trackEvent with eventType='app_open'
export const dailyActiveUsers = query({
  args: { day: v.string() },
  handler: async (ctx, { day }) => {
    const seen = new Set<string>();
    const { startMs, endMs } = dayRangeUtc(day);
    // Prefer index if available; fallback to full scan if not
    const events = await ctx.db
      .query("events")
      .withIndex("by_type_ts", (q) => q.eq("eventType", "app_open"))
      .collect();

    for (const ev of events) {
      if (ev.eventType !== "app_open") continue;
      const evDay = (ev as any)?.payload?.day as string | undefined;
      // Use payload.day when present, otherwise fallback to timestamp window
      const inDay = evDay ? evDay === day : ev.ts >= startMs && ev.ts <= endMs;
      if (!inDay) continue;
      const id = ev.userId ?? ev.anonymousId; // Prefer Clerk subject if present, fallback to tokenIdentifier
      if (id) seen.add(id);
    }
    return { day, dau: seen.size } as const;
  },
});

// Utility: UTC range for a YYYY-MM-DD day
function dayRangeUtc(day: string): { startMs: number; endMs: number } {
  const start = Date.parse(`${day}T00:00:00Z`);
  const end = Date.parse(`${day}T23:59:59.999Z`);
  return { startMs: start, endMs: end };
}

// Aggregate counts per eventType for a given day
export const dailyEventCounts = query({
  args: { day: v.string() },
  handler: async (ctx, { day }) => {
    const { startMs, endMs } = dayRangeUtc(day);
    const counts: Record<string, number> = {};
    const events = await ctx.db.query("events").collect();
    for (const ev of events) {
      const evDay = (ev as any)?.payload?.day as string | undefined;
      const inDay = evDay ? evDay === day : ev.ts >= startMs && ev.ts <= endMs;
      if (!inDay) continue;
      counts[ev.eventType] = (counts[ev.eventType] ?? 0) + 1;
    }
    const items = Object.entries(counts)
      .map(([eventType, count]) => ({ eventType, count }))
      .sort((a, b) => b.count - a.count);
    return { day, items } as const;
  },
});

// Top-N most viewed assets (by slug) for a kind over a date range (inclusive)
export const topViewedAssets = query({
  args: {
    kind: v.string(), // 'ingredient' | 'meal'
    from: v.string(),
    to: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { kind, from, to, limit = 10 }) => {
    const startMs = Date.parse(`${from}T00:00:00Z`);
    const endMs = Date.parse(`${to}T23:59:59.999Z`);
    const tally = new Map<string, number>();
    const events = await ctx.db.query("events").collect();
    for (const ev of events) {
      if (ev.eventType !== "asset_view") continue;
      if (ev.ts < startMs || ev.ts > endMs) continue;
      const payload = (ev as any)?.payload ?? {};
      if (payload.kind !== kind) continue;
      const slug = payload.slug as string | undefined;
      if (!slug) continue;
      tally.set(slug, (tally.get(slug) ?? 0) + 1);
    }
    const items = Array.from(tally.entries())
      .map(([slug, count]) => ({ slug, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
    return { kind, from, to, items } as const;
  },
});

// Aggregate active users per day over an inclusive date range (YYYY-MM-DD)
// Returns an array sorted by day ascending: [{ day, dau, items: [...] }]
export const listActiveUsersForRange = query({
  args: { from: v.string(), to: v.string() },
  handler: async (ctx, { from, to }) => {
    // Helper to check if day lies within [from, to]
    const inRange = (d: string) => d >= from && d <= to;

    // Collect app_open events once
    const events = await ctx.db.query("events").collect();

    // Group identities per day
    const perDay = new Map<string, Map<string, { userId?: string; anonymousId?: string }>>();
    for (const ev of events) {
      if (ev.eventType !== "app_open") continue;
      const evDay = (ev as any)?.payload?.day as string | undefined;
      if (!evDay || !inRange(evDay)) continue;
      const key = (ev.userId ?? ev.anonymousId) as string | undefined;
      if (!key) continue;
      if (!perDay.has(evDay)) perDay.set(evDay, new Map());
      const bucket = perDay.get(evDay)!;
      if (!bucket.has(key)) bucket.set(key, { userId: ev.userId ?? undefined, anonymousId: ev.userId ? undefined : ev.anonymousId });
    }

    // Enrich with optional user docs and build results
    const days = Array.from(perDay.keys()).sort();
    const results: Array<{ day: string; dau: number; items: Array<{ id: string; userId?: string; anonymousId?: string; user?: any }> }> = [];
    for (const day of days) {
      const bucket = perDay.get(day)!;
      const items: Array<{ id: string; userId?: string; anonymousId?: string; user?: any }> = [];
      for (const [id, info] of bucket.entries()) {
        let userDoc: any = null;
        if (info.userId) {
          const rows = await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("userId", info.userId!))
            .collect();
          userDoc = rows[0] ?? null;
        }
        items.push({ id, ...info, user: userDoc });
      }
      results.push({ day, dau: items.length, items });
    }

    // Ensure empty days in range appear if needed (optional): skip for now for simplicity
    return { from, to, days: results } as const;
  },
});

// Return distinct identities (userId or anonymousId) that opened the app on a given day
// Optionally joins with the 'users' table via by_userId index to enrich with profile data
export const listActiveUsersForDay = query({
  args: { day: v.string() },
  handler: async (ctx, { day }) => {
    const map = new Map<string, { userId?: string; anonymousId?: string }>();
    const events = await ctx.db.query("events").collect();
    for (const ev of events) {
      if (ev.eventType !== "app_open") continue;
      const evDay = (ev as any)?.payload?.day as string | undefined;
      if (evDay !== day) continue;
      const key = (ev.userId ?? ev.anonymousId) as string | undefined;
      if (!key) continue;
      if (!map.has(key)) map.set(key, { userId: ev.userId ?? undefined, anonymousId: ev.userId ? undefined : ev.anonymousId });
    }

    const results: Array<{ id: string; userId?: string; anonymousId?: string; user?: any }> = [];
    for (const [id, info] of map.entries()) {
      let userDoc: any = null;
      if (info.userId) {
        const rows = await ctx.db
          .query("users")
          .withIndex("by_userId", (q) => q.eq("userId", info.userId!))
          .collect();
        userDoc = rows[0] ?? null;
      }
      results.push({ id, ...info, user: userDoc });
    }
    return { day, total: results.length, items: results } as const;
  },
});

// Latency stats for a given eventType in a date range: uses (server ts - client payload.clientTs)
export const latencyStats = query({
  args: { eventType: v.string(), from: v.string(), to: v.string() },
  handler: async (ctx, { eventType, from, to }) => {
    const startMs = Date.parse(`${from}T00:00:00Z`);
    const endMs = Date.parse(`${to}T23:59:59.999Z`);
    const durations: number[] = [];
    const events = await ctx.db.query("events").collect();
    for (const ev of events) {
      if (ev.eventType !== eventType) continue;
      if (ev.ts < startMs || ev.ts > endMs) continue;
      const clientTs = Number((ev as any)?.payload?.clientTs ?? NaN);
      if (!Number.isFinite(clientTs)) continue;
      const d = Math.max(0, ev.ts - clientTs);
      durations.push(d);
    }
    if (durations.length === 0) {
      return { eventType, from, to, count: 0, p50: 0, p95: 0, p99: 0, avg: 0, min: 0, max: 0 } as const;
    }
    durations.sort((a, b) => a - b);
    const q = (p: number) => durations[Math.min(durations.length - 1, Math.floor((p / 100) * durations.length))];
    const sum = durations.reduce((acc, x) => acc + x, 0);
    const avg = sum / durations.length;
    const min = durations[0];
    const max = durations[durations.length - 1];
    return {
      eventType,
      from,
      to,
      count: durations.length,
      p50: q(50),
      p95: q(95),
      p99: q(99),
      avg,
      min,
      max,
    } as const;
  },
});
