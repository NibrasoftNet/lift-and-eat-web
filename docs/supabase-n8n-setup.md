# Configuration Supabase + n8n pour Waitlist

## 🎯 Architecture

**Frontend** → **API `/waitlist`** → **Supabase** ← **n8n (Raspberry Pi)**

## 📋 Étapes d'installation

### 1. Configuration Supabase

1. **Créer un projet Supabase** (gratuit)
   - Aller sur [supabase.com](https://supabase.com)
   - Créer un nouveau projet
   - Noter l'URL et les clés API

2. **Créer la table** dans l'éditeur SQL Supabase
   ```sql
   -- Copier/coller le contenu de supabase-setup.sql
   ```

3. **Récupérer les clés**
   - **URL** : `https://your-project-id.supabase.co`
   - **Anon Key** : Dans Settings > API
   - **Service Role Key** : Dans Settings > API (⚠️ Garder secret)

### 2. Configuration du projet

1. **Créer `.env.local`**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Remplir les variables**
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```

3. **Redémarrer le serveur**
   ```bash
   npm run dev
   ```

### 3. Test de l'API

```bash
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","locale":"ar","source":"hero"}'
```

**Réponses attendues :**
- ✅ `{"ok":true,"message":"saved","id":"uuid"}`
- ⚠️ `{"ok":true,"message":"already registered"}` (doublon)
- ❌ `{"ok":false,"message":"server not configured"}` (variables manquantes)

### 4. Configuration n8n sur Raspberry Pi

#### Installation n8n
```bash
# Sur le Raspberry Pi
npm install -g n8n
n8n start
```

#### Import du workflow complet

**Fichier JSON prêt à importer** : `docs/n8n-waitlist-workflow.json`

1. **Dans n8n** : Settings > Import from file
2. **Sélectionner** : `n8n-waitlist-workflow.json`
3. **Configurer les credentials** (voir section suivante)

#### Configuration des credentials

**1. Supabase API Auth**
- **Name** : `Supabase API Auth`
- **Type** : HTTP Header Auth
- **Header Name** : `Authorization`
- **Header Value** : `Bearer YOUR_ANON_KEY`
- **Additional Headers** :
  ```
  apikey: YOUR_ANON_KEY
  Content-Type: application/json
  ```

**2. SMTP Credentials** (optionnel - pour emails)
- **Name** : `SMTP Credentials`
- **Host** : `smtp.gmail.com` (ou votre provider)
- **Port** : `587`
- **Username** : votre email
- **Password** : mot de passe d'application

**3. Google Sheets OAuth2** (optionnel - pour backup)
- **Name** : `Google Sheets OAuth2`
- Suivre l'assistant de connexion Google

#### Personnalisation du workflow

**Variables à modifier dans le JSON :**
- `YOUR_PROJECT_ID` → votre ID projet Supabase
- `YOUR_GOOGLE_SHEET_ID` → ID de votre Google Sheet
- `YOUR/SLACK/WEBHOOK` → webhook Slack (optionnel)
- Email expéditeur dans le node "Send Welcome Email"

**Fonctionnalités incluses :**
- ✅ Récupération emails toutes les 5 minutes
- ✅ Email de bienvenue personnalisé (HTML)
- ✅ Sauvegarde Google Sheets
- ✅ Notification Slack
- ✅ Marquage comme traité dans Supabase

### 5. Monitoring et maintenance

#### Vérifier les données Supabase
```sql
-- Voir tous les emails
SELECT * FROM waitlist_entries ORDER BY created_at DESC;

-- Compter par source
SELECT source, COUNT(*) FROM waitlist_entries GROUP BY source;

-- Emails non traités
SELECT * FROM waitlist_entries WHERE processed_by_n8n = false;
```

#### Logs n8n
- Interface web : `http://raspberry-pi-ip:5678`
- Logs : Executions > View details

## 🔧 Dépannage

### Erreur "server not configured"
- Vérifier `.env.local` existe et contient les bonnes clés
- Redémarrer `npm run dev`

### Erreur "database error"
- Vérifier que la table `waitlist_entries` existe
- Vérifier les permissions RLS dans Supabase

### n8n ne récupère pas les emails
- Vérifier l'URL Supabase dans n8n
- Tester la requête manuellement :
  ```bash
  curl "https://your-project-id.supabase.co/rest/v1/waitlist_entries?processed_by_n8n=eq.false" \
    -H "Authorization: Bearer YOUR_ANON_KEY" \
    -H "apikey: YOUR_ANON_KEY"
  ```

## 📊 Avantages de cette architecture

✅ **100% gratuit** (Supabase 500MB + n8n self-hosted)  
✅ **Fiable** (base de données vs mémoire RAM)  
✅ **Évolutif** (Supabase peut servir d'autres features)  
✅ **Flexible** (n8n peut traiter par batch, ajouter logique)  
✅ **Persistant** (survit aux redémarrages du serveur)  

## 🚀 Prochaines étapes

1. Configurer Supabase et tester l'API
2. Installer n8n sur le Raspberry Pi
3. Créer le flux de traitement des emails
4. Ajouter l'envoi d'emails de bienvenue
5. Optionnel : Dashboard analytics avec les données Supabase
