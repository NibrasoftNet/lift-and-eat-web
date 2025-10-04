"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    convex.setAuth(async () => {
      if (!isSignedIn) return null;
      try {
        const token = (await getToken({ template: "convex" })) ?? (await getToken());
        return token ?? null;
      } catch {
        return null;
      }
    });
  }, [getToken, isSignedIn]);

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
