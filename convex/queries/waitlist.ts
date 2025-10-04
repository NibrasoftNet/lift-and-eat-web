import { v } from "convex/values";
import { query } from "../_generated/server";

export const findByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();
    
    return await ctx.db
      .query("waitlist_entries")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
  },
});

export const list = query({
  args: {
    limit: v.optional(v.number()),
    cursorCreatedAt: v.optional(v.string()),
    direction: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    const direction = args.direction || "desc";
    
    let query = ctx.db.query("waitlist_entries").withIndex("by_created_at");
    
    if (args.cursorCreatedAt) {
      if (direction === "desc") {
        query = query.filter((q) => q.lt(q.field("created_at"), args.cursorCreatedAt!));
      } else {
        query = query.filter((q) => q.gt(q.field("created_at"), args.cursorCreatedAt!));
      }
    }
    
    const results = await query.take(limit + 1);
    
    // Sort in memory to ensure correct order
    const sorted = results.sort((a, b) => {
      if (direction === "desc") {
        return b.created_at.localeCompare(a.created_at);
      } else {
        return a.created_at.localeCompare(b.created_at);
      }
    });
    
    const hasMore = sorted.length > limit;
    const items = hasMore ? sorted.slice(0, limit) : sorted;
    const nextCursor = hasMore ? items[items.length - 1].created_at : undefined;
    
    return {
      items,
      nextCursor,
      hasMore,
    };
  },
});
