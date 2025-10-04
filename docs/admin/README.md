# Admin — Pack de handoff

Bienvenue ! Ce dossier contient tout le nécessaire pour créer l’Admin Dashboard connecté à Convex.

## Contenu

- `admin-dashboard-handoff.md` — Spécification complète (objectifs, portée, sécurité, endpoints clés)
- `admin-dashboard-checklist.md` — Checklist projet (phases, QA, livraison) — étapes déjà cochées quand réalisées
- `convex-data-dictionary.md` — Dictionnaire des données (tables, champs, index, relations)
- `api-reference.md` — Référence des endpoints Convex (queries/mutations/actions)
- `admin-dev-setup.md` — Guide d’installation (env, tokens, exemples d’appels client/server)
- `seed-payload-example.json` — Exemple de payload pour le seed des assets

## Démarrage rapide

1) Lisez `admin-dev-setup.md` et configurez `NEXT_PUBLIC_CONVEX_URL` (+ Clerk si nécessaire).
2) Implémentez les pages Catalogue (Ingrédients/Repas) via `queries.assets.*`.
3) Créez une route server-only `/api/seed` et appelez `actions.seedAssets.seedAssets` avec `SEED_ADMIN_TOKEN`.
4) Ajoutez les pages Analytics via `queries.analytics.*`.
5) Suivez `admin-dashboard-checklist.md` et cochez les étapes.
