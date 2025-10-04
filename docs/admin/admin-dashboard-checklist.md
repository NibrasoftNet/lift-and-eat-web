# Checklist — Admin Dashboard (Convex)

Dernière mise à jour: 2025-10-02 11:37 (+01:00)

Lisez d’abord `docs/admin/admin-dashboard-handoff.md`, puis suivez cette checklist.

## Phase 1 — Découverte & Accès

- [x] 1.1. Récupérer l’URL Convex et le Dashboard
  - `https://fabulous-stork-993.convex.cloud`
  - `https://dashboard.convex.dev/d/fabulous-stork-993`
- [x] 1.2. Vérifier la config Auth Clerk côté Convex (`convex/auth.config.ts`)
  - Domain: `https://sought-humpback-85.clerk.accounts.dev`
  - ApplicationID: `convex`
- [x] 1.3. Définir le flux d’accès Admin (SEED_ADMIN_TOKEN)
  - Créer/placer `SEED_ADMIN_TOKEN` dans l’Env Convex

## Phase 2 — Modèle de données (Convex)

- [x] 2.1. Lire `convex/schema.ts` et lister les tables & indexes
- [x] 2.2. Documenter le dictionnaire de données
  - Sous-étape réalisée: `docs/admin/convex-data-dictionary.md`

## Phase 3 — API & Endpoints

- [x] 3.1. Inventaire des queries/mutations/actions
  - Fichiers: `convex/queries/*`, `convex/mutations/*`, `convex/actions/*`
- [x] 3.2. Rédiger la référence API (contrats)
  - Sous-étape réalisée: `docs/admin/api-reference.md`

## Phase 4 — Spécification produit Admin

- [x] 4.1. Définir les pages, rôles & ACL, KPIs
- [x] 4.2. Rédiger le handoff complet
  - Sous-étape réalisée: `docs/admin/admin-dashboard-handoff.md`

## Phase 5 — Setup Dev Admin

- [x] 5.1. Préparer le guide d’installation (env, clés, tokens)
  - Sous-étape réalisée: `docs/admin/admin-dev-setup.md`
- [ ] 5.2. (Optionnel) Créer un repo Admin (Next.js + Convex + Clerk)
- [ ] 5.3. (Optionnel) Intégrer un thème UI + i18n Admin

## Phase 6 — Implémentation & Tests

- [ ] 6.1. Implémenter Catalogue Ingrédients
- [ ] 6.2. Implémenter Catalogue Repas + composition
- [ ] 6.3. Implémenter Seed (upload JSON + appel `actions.seedAssets`)
- [ ] 6.4. Implémenter Analytics (DAU, événements, top assets, latence)
- [ ] 6.5. Implémenter Support Utilisateur (lecture seule)

## Phase 7 — QA & Sécurité

- [ ] 7.1. QA i18n (FR/EN/AR) pour assets
- [ ] 7.2. QA pagination & perfs (listes > 1k éléments)
- [ ] 7.3. Vérifier la garde Seed (`SEED_ADMIN_TOKEN`) et limiter l’accès Admin
- [ ] 7.4. (Optionnel) Forcer Auth Clerk pour analytics/assets si nécessaire

## Phase 8 — Livraison

- [ ] 8.1. Documentation finale (README Admin, .env.examples)
- [ ] 8.2. Démonstration + passation
- [ ] 8.3. Plan de maintenance (mises à jour seeds, évolutions schéma)
