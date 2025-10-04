import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const joinWaitlist = mutation({
  args: {
    email: v.string(),
    locale: v.optional(v.string()),
    source: v.optional(v.string()),
    ip_address: v.optional(v.string()),
    user_agent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Normalize and validate email
    const email = args.email.toLowerCase().trim();
    
    if (!email || !email.includes("@")) {
      throw new Error("Invalid email format");
    }

    // Check if email already exists
    const existing = await ctx.db
      .query("waitlist_entries")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) {
      // Update existing entry with new metadata
      await ctx.db.patch(existing._id, {
        locale: args.locale || existing.locale,
        source: args.source || existing.source,
        ip_address: args.ip_address || existing.ip_address,
        user_agent: args.user_agent || existing.user_agent,
      });
      
      return {
        id: existing._id,
        created_at: existing.created_at,
        status: "updated" as const,
      };
    } else {
      // Create new entry
      const id = await ctx.db.insert("waitlist_entries", {
        email,
        locale: args.locale,
        source: args.source,
        ip_address: args.ip_address,
        user_agent: args.user_agent,
        created_at: new Date().toISOString(),
      });

      // Track analytics event
      await ctx.db.insert("events", {
        eventType: "waitlist_join",
        ts: Date.now(),
        anonymousId: email, // Use email as anonymous identifier
        userId: undefined,
        sessionId: undefined,
        payload: {
          email,
          source: args.source || "unknown",
          locale: args.locale || "unknown",
        },
        appVersion: undefined,
      });

      return {
        id,
        created_at: new Date().toISOString(),
        status: "inserted" as const,
      };
    }
  },
});
