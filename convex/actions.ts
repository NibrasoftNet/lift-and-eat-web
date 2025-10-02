import { action } from "./_generated/server";
import { v } from "convex/values";

// Action pour seed les données d'exemple
export const seedAssets = action({
  args: {
    version: v.number(),
    force: v.optional(v.boolean()),
  },
  handler: async (_ctx, args) => {
    // Placeholder - sera implémenté après régénération de l'API
    return {
      success: true,
      message: `Seed placeholder (version ${args.version}) - API en cours de régénération`,
      version: args.version,
      stats: {
        ingredients: 0,
        meals: 0,
        mealIngredients: 0,
        activeUsers: 0,
        assetViews: 0,
      }
    };
  },
});

// Action pour obtenir la version des données
export const getAssetsVersion = action({
  args: {},
  handler: async () => {
    // Placeholder - sera implémenté après régénération de l'API
    return { 
      version: 0, 
      hasData: false,
      totalIngredients: 0 
    };
  },
});
