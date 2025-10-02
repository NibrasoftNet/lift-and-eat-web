# Guide d'installation — Admin Dashboard (Convex)

Dernière mise à jour: 2025-10-02 11:37 (+01:00)

Ce guide explique comment un développeur peut préparer un environnement pour construire l'Admin Dashboard connecté à Convex et (optionnellement) à Clerk.

---

## 1) Prérequis

- Node.js ≥ 18
- Framework web conseillé: Next.js 14+ (ou Remix) — SSR possible pour sécuriser les opérations sensibles (seed)
- Packages:
  - `convex` (client navigateur) ou `convex/server` (côté serveur Next/Remix)
  - `@clerk/nextjs` (si vous souhaitez restreindre l'accès Admin via Clerk)

---

## 2) Accès Convex

- URL Convex: `https://fabulous-stork-993.convex.cloud`
- Dashboard Convex: `https://dashboard.convex.dev/d/fabulous-stork-993`

Variables d'environnement (côté Front Admin):

- `NEXT_PUBLIC_CONVEX_URL=https://fabulous-stork-993.convex.cloud`

Note: si vous intégrez Clerk côté Admin (recommandé), ajoutez aussi:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...`
- `CLERK_SECRET_KEY=...` (server-side uniquement)

---

## 3) Authentification Clerk (optionnelle mais recommandée)

Côté Convex (déjà configuré): `convex/auth.config.ts`

- `domain: https://sought-humpback-85.clerk.accounts.dev`
- `applicationID: 'convex'` (Créez un JWT Template "convex" dans Clerk)

Côté Admin (Next.js):

- Protéger les pages Admin via Clerk (`withServerSideAuth`/`SignedIn`, etc.)
- Si vous avez besoin d'appeler des endpoints owner-only (peu probable pour Admin public), passez le token Clerk côté client Convex.

---

## 4) Client Convex — Utilisation basique

Exemple Next.js (client):

```ts
// app/(admin)/ingredients/page.tsx
'use client';
import { ConvexReactClient } from 'convex/react';
import { api } from '@/convex/_generated/api';

const client = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function IngredientsPage() {
  const [items, setItems] = React.useState<any[]>([]);
  React.useEffect(() => {
    client
      .query(api.queries.assets.listIngredients, { page: 1, limit: 50 })
      .then((res) => setItems(res.items));
  }, []);
  return <pre>{JSON.stringify(items, null, 2)}</pre>;
}
```

Exemple Next.js (server) — recommandé pour opérations sensibles (seed):

```ts
// app/api/seed/route.ts (Next.js App Router)
import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

export async function POST() {
  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const adminToken = process.env.SEED_ADMIN_TOKEN!; // NE PAS exposer côté client

  const payload = /* charger JSON depuis storage ou body */ {
    ingredients: [],
    meals: [],
    mealIngredients: [],
    assetsDataVersion: 2,
    adminToken,
  };

  const res = await client.action(api.actions.seedAssets.seedAssets, payload);
  return NextResponse.json(res);
}
```

---

## 5) Sécurité — Seed & Tokens

- Le endpoint d'action `actions.seedAssets.seedAssets` requiert `adminToken` qui doit matcher `SEED_ADMIN_TOKEN` configuré côté Convex.
- Ne JAMAIS mettre `SEED_ADMIN_TOKEN` en variable publique (`NEXT_PUBLIC_*`) ou dans un client navigateur.
- Utiliser une route serverless (Next.js `app/api`) pour relayer l'appel à l'action Convex depuis le serveur.

Checklist sécurité:

- `SEED_ADMIN_TOKEN` défini dans l'environnement Convex (Dashboard → Settings → Environment Variables)
- `SEED_ADMIN_TOKEN` défini côté Admin (server-only) pour la route seed
- Pages Admin protégées via Clerk (ou autre mécanisme) si l'admin ne doit pas être public

---

## 6) Données & i18n

- Voir `docs/admin/convex-data-dictionary.md` pour la description complète des tables et relations.
- Voir `docs/admin/api-reference.md` pour les endpoints disponibles.
- Exemple de payload de seed: `docs/admin/seed-payload-example.json`

---

## 7) Analytics

Endpoints utiles:

- `queries.analytics.dailyActiveUsers({ day })`
- `queries.analytics.dailyEventCounts({ day })`
- `queries.analytics.topViewedAssets({ kind, from, to, limit? })`
- `queries.analytics.latencyStats({ eventType, from, to })`

Affichages recommandés:

- Cartes (cards) avec métriques clés
- Graphiques (bar/line) par jour
- Tables détaillées (Top assets)

---

## 8) Démarrage rapide (résumé)

1. Créez un projet Next.js (ou Remix) pour l'Admin.
2. Ajoutez `NEXT_PUBLIC_CONVEX_URL` dans `.env.local`.
3. (Optionnel) Intégrez Clerk et protégez les pages Admin.
4. Implémentez les pages Catalogue (Ingrédients/Repas) via queries Convex.
5. Créez une route serverless `/api/seed` et appelez `actions.seedAssets.seedAssets` avec `SEED_ADMIN_TOKEN` (server-only).
6. Ajoutez les pages Analytics (KPIs) via `queries.analytics.*`.
7. Testez sur un environnement de staging avant la prod.
