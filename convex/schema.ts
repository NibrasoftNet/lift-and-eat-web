import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  waitlist_entries: defineTable({
    email: v.string(),
    locale: v.string(),
    source: v.string(),
    ip_address: v.optional(v.string()),
    user_agent: v.optional(v.string()),
    created_at: v.string(), // ISO string
  })
    .index("by_email", ["email"])
    .index("by_created_at", ["created_at"]),
});
