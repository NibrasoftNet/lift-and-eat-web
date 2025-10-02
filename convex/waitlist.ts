import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mutation pour ajouter une entrée à la waitlist
export const registerToWaitlist = mutation({
  args: {
    email: v.string(),
    locale: v.optional(v.string()),
    source: v.optional(v.string()),
    ip_address: v.optional(v.string()),
    user_agent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Vérifier si l'email existe déjà
    const existingEntry = await ctx.db
      .query("waitlist_entries")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingEntry) {
      return { 
        success: false, 
        error: "Email already registered",
        id: existingEntry._id 
      };
    }

    // Créer la nouvelle entrée
    const entry = await ctx.db.insert("waitlist_entries", {
      email: args.email,
      locale: args.locale || "en",
      source: args.source || "web",
      ip_address: args.ip_address,
      user_agent: args.user_agent,
      created_at: new Date().toISOString(),
    });

    return { 
      success: true, 
      id: entry,
      message: "Successfully registered to waitlist"
    };
  },
});

// Query pour récupérer les entrées de la waitlist (pour l'admin plus tard)
export const getWaitlistEntries = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 100;
    
    return await ctx.db
      .query("waitlist_entries")
      .withIndex("by_created_at")
      .order("desc")
      .take(limit);
  },
});

// Query pour compter le nombre total d'entrées
export const getWaitlistCount = query({
  handler: async (ctx) => {
    const entries = await ctx.db.query("waitlist_entries").collect();
    return entries.length;
  },
});
