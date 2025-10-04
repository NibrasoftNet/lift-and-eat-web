// https://docs.convex.dev/auth/clerk
export default {
  providers: [
    {
      // Hardcoded for debugging: ensures Convex matches Clerk token issuer exactly.
      domain: 'https://sought-humpback-85.clerk.accounts.dev',
      applicationID: 'convex',
    },
  ],
};
