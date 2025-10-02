// convex/queries/debug.ts
import { query } from "../_generated/server";

export const whoami = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const envIssuerDomain = process.env.CLERK_JWT_ISSUER_DOMAIN ?? null;
    const envIssuerUrl = process.env.CLERK_ISSUER_URL ?? null;
    return {
      identity,
      envIssuerDomain,
      envIssuerUrl,
      hasIdentity: !!identity,
    } as const;
  },
});
