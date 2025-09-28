# Checklist refactor Landing + Waitlist bêta

> Maintien: cochez chaque étape terminée et ajoutez des sous-étapes si vous effectuez des actions non listées (règle projet).

## État actuel — terminé
- [x] Audit de la structure Landing et des dépendances
  - Page: `app/[locale]/page.tsx`
  - Sections: `Navbar`, `HeroSection`, `FeaturesSection`, `AISection`, `AnalysisSection`, `Footer`
  - Animations: `utlis/animations` (GSAP, parallax, fade/slide)
- [x] Palette de marque appliquée (vert primaire, fond clair, orange secondaire)
  - Fichier: `styles/globals.css` (tokens `--primary: #A4C73B`, `--background: #F7FBF1`, `--secondary: #F39C12`)
- [x] Metadata et favicon
  - `app/[locale]/layout.tsx` → `themeColor` clair/sombre, `icons: /favicon.ico`
  - `app/favicon.ico` remplacé par le logo
- [x] Harmonisation classes → tokens
  - `components/landing/AnalysisSection.tsx` utilise désormais `text-primary`, `border-primary`, bouton par défaut
  - [x] Logo: wiring du chemin via constante `logoImage` + override par `NEXT_PUBLIC_LOGO_PATH`

---

## Backlog refactor Landing (à réaliser)

### 1) Stratégie de contenu et structure
- [ ] Définir la proposition de valeur (headline + subheadline) par langue
- [ ] Définir la structure cible de la page:
  - [ ] Hero avec formulaire Waitlist (email) et CTA
  - [ ] Social proof (logos presse/partenaires, témoignages courts)
  - [ ] Features (3–6 cartes avantages clés)
  - [ ] How it works (étapes simples)
  - [ ] Dashboard preview (ex-`AnalysisSection`)
  - [ ] FAQ
  - [ ] CTA final + Footer

### 2) Formulaire Waitlist (bêta)
- [x] Créer `components/forms/waitlist-form.tsx`
  - [x] `react-hook-form` + `zod` (`zodResolver`)
  - [x] Champs: email (obligatoire), prénom/nom (optionnel), consentement RGPD (checkbox), `locale` (hidden)
  - [x] UI: `Input`, `Button`, messages d’état dans un conteneur `aria-live`
  - [x] Gestion loading + désactivation bouton
- [x] Intégrer dans `HeroSection.tsx` (principal) et `Footer.tsx` (mini-form)
  - [x] Ajouter le formulaire sous le CTA (Hero) et un mini-formulaire (Footer)
- [ ] Analytics
  - [ ] Événement “waitlist_signup” (Plausible/GA) côté client après succès

### 3) API Waitlist (stockage des emails)
- [x] Choisir le provider de stockage:
  - [x] Choisi: n8n Webhook → Google Sheets (gratuit)
  - Option A: Airtable | Option B: Supabase | Option C: Mailchimp | Option D: JSON/CSV (dev)
- [ ] Variables d’environnement + validation
  - [ ] Ajouter clés à `.env.local` (`WAITLIST_WEBHOOK_URL`, `WAITLIST_WEBHOOK_SECRET?`)
  - [x] Étendre `libs/Env.ts` pour ces variables
- [x] Créer `app/api/waitlist/route.ts` (POST)
  - [x] Validation `zod`: `{ email, locale?, source? }`
  - [x] Anti-doublons (même email) (12h)
  - [x] Rate limiting (1 req/min/IP, 20 req/h/IP)
  - [x] Filtre domaines jetables (anti-spam) basique
  - [x] Retour JSON standard `{ ok, message }`
- [ ] Tests rapides (curl/REST client)

### 4) Refactor UI/Sections
- [x] `HeroSection.tsx`
  - [x] Nouvelle mise en page responsive (grid 2 colonnes desktop, stack mobile)
  - [x] Ajout du `WaitlistForm` sous le sous-titre
  - [x] Résolution problèmes de superposition (z-index, layout)
  - [x] Logos stores repositionnés correctement
  - [ ] BG subtil en `--background`, visuel d'app (optimisé)
  - [ ] Respect "réduction des animations" (`prefers-reduced-motion`)
- [x] `FeaturesSection.tsx`
  - [x] Cartes avec icônes (shadcn Cards), contrastes AA
  - [x] Images avec cadres smartphone mockup
  - [x] Positionnement optimisé (items-start, mt-24)
- [x] `AISection.tsx`
  - [x] Bénéfices concrets avec 3 cartes détaillées
  - [x] Images avec cadres smartphone mockup
  - [x] Positionnement optimisé (items-start, mt-16)
- [x] `AnalysisSection.tsx` (Dashboard)
  - [x] Uniformisation tokens (`text-primary`, `border-primary`)
  - [x] Images avec cadres smartphone mockup
  - [x] Positionnement optimisé (items-start, mt-16)
- [x] `Navbar.tsx`
  - [x] Bouton "Rejoindre la bêta" scroll vers Hero
  - [x] Logo centré au milieu (desktop et mobile)
- [x] `Footer.tsx`
  - [x] Mini-formulaire waitlist + liens légaux

### 5) i18n
- [x] Ajouter clés dans `locales/en.json`, `fr.json`, `ar.json` (exemple)
  - `Waitlist.title`, `Waitlist.subtitle`, `Waitlist.emailPlaceholder`, `Waitlist.cta`, `Waitlist.success`, `Waitlist.error`, `Waitlist.consent`

### 6) Accessibilité
- [x] Labels et `aria-describedby` pour champs (WaitlistForm)
- [x] Messages d'erreur et succès avec `role="status"`/`aria-live="polite"`
- [ ] Navigation clavier complète, focus visible (`ring`)

### 7) Performance
- [x] `next/image` pour visuels, tailles réactives (toutes les sections)
- [x] Optimisation `sizes` pour responsive images
- [ ] Lazy/dynamic import pour sections lourdes
- [ ] Audits Lighthouse (Perf/SEO/Best Practices/Accessibility ≥ 90)

### 8) SEO & Open Graph
- [ ] Titre/description par locale
- [ ] `openGraph` + `twitter` images (hero/dash)
- [ ] JSON-LD `SoftwareApplication`

### 9) QA & Livraison
- [ ] Tests manuels: desktop/mobile + RTL/LTR
- [ ] E2E basique (Playwright) pour la soumission waitlist
- [ ] Doc: `docs/waitlist.md` (flows, variables, export des emails)

---

## Décisions à valider
- [ ] Teinte orange finale (par défaut `#F39C12`)
- [x] Provider de stockage: n8n → Google Sheets (gratuit)

### 10) Branding & Assets
- [ ] Remplacer le fichier logo par votre version finale
  - Option A: remplacer `public/images/logo_no_bg.png` (même nom)
  - Option B: définir `.env.local` → `NEXT_PUBLIC_LOGO_PATH="/images/votre-logo.svg"`
- [ ] Vérifier affichage logo dans `Navbar`, `Footer`, `GeneralSettingNavbar`
 - [x] Captures d'écran intégrées (constants mis à jour)
   - [x] Cadres smartphone ajoutés à toutes les captures (mockup-phone)
   - Remplacements appliqués:
     - `hero-image.jpg` → `meal_page.webp` (avec cadre smartphone)
     - `analysis-image.png` → `trackers.webp` (avec cadre smartphone)
     - `ai-assistant-image.jpg` → `assistant.webp` (avec cadre smartphone)
     - `features-image.jpg` → `plan_detail.webp` (avec cadre smartphone)
   - Tailles optimisées pour équilibrer avec le texte adjacent
   - SEO: `og-landing.png` (1200×630), `og-dashboard.png` (1200×630) - à fournir

## État actuel (complété)
- [x] Structure de base responsive avec grilles
- [x] Toutes les sections avec captures d'écran authentiques
- [x] Cadres smartphone mockup uniformes
- [x] Positionnement images optimisé (alignement texte)
- [x] Formulaire waitlist avec validation et analytics
- [x] Navigation fonctionnelle avec scroll smooth
- [x] Footer complet avec liens légaux
- [x] i18n multilingue (FR/EN/AR)
- [x] Accessibilité de base (aria-live, labels)
- [x] Images optimisées avec next/image et sizes

## Améliorations UX/UI suggérées (audit Directeur Produit)

### Éléments manquants critiques :
- [x] Section "Comment ça marche" (3 étapes) - ✅ Créée avec scanner/recherche INNTA
- [x] Section FAQ - ✅ 6 questions sur bêta fermée, INNTA, sécurité
- [ ] Section pricing/plans (même en bêta gratuite)
- [x] Éléments de réassurance ("Gratuit", "Sécurisé", etc.) - ✅ Section avec 4 éléments clés
- [ ] Urgence/scarcité ("Places limitées pour la bêta fermée", etc.)
- [x] Preuves sociales alternatives (équipe, technologie, vision produit) - ✅ Focus tunisien/INNTA
- [ ] Video démo courte
- [ ] Micro-animations (scroll reveal)

### Optimisations CTA :
- [ ] "Commencer GRATUITEMENT" au lieu de "Rejoindre la bêta"
- [ ] Badge "BÊTA GRATUITE" visible
- [ ] CTA secondaire "Voir la démo"
- [ ] Sticky CTA mobile

### Métriques à tracker :
- [ ] Taux de conversion waitlist
- [ ] Scroll depth par section
- [ ] Clics CTA par position
- [ ] Abandon formulaire

## Plan de livraison (suggestion)
1. Structure + i18n (0.5 j) ✅ TERMINÉ
2. WaitlistForm + API + envs (0.5–1 j) ✅ TERMINÉ
3. Intégrations UI (0.5 j) ✅ TERMINÉ
4. Optimisations UX/UI (1-2 j) - PROCHAINE ÉTAPE
5. QA + déploiement (0.5 j)
