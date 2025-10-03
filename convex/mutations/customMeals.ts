// convex/mutations/customMeals.ts
import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const upsert = mutation({
  args: {
    clientId: v.string(),
    name: v.optional(v.string()),
    macrosPer100g: v.object({
      kcal: v.number(),
      protein: v.number(),
      carbs: v.number(),
      fat: v.number(),
    }),
    imageKey: v.optional(v.string()),
  },
  handler: async (ctx, { clientId, name, macrosPer100g, imageKey }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const userId = identity.subject;

    const now = Date.now();
    const db: any = ctx.db as any;
    const existing = await db
      .query("custom_meals")
      .withIndex("by_user_clientId", (q: any) =>
        q.eq("userId", userId).eq("clientId", clientId)
      )
      .collect();

    if (existing.length > 0) {
      const row = existing[0];
      await db.patch(row._id, {
        updatedAt: now,
        ...(typeof name === "string" ? { name } : {}),
        macrosPer100g,
        ...(imageKey ? { imageKey } : {}),
      });
      return { created: false, updated: true } as const;
    }

    const id = await db.insert("custom_meals", {
      userId,
      clientId,
      name,
      macrosPer100g,
      imageKey,
      createdAt: now,
      updatedAt: now,
    });
    return { created: true, updated: false, id } as const;
  },
});
