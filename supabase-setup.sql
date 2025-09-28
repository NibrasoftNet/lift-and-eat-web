-- Table pour stocker les inscriptions à la waitlist
CREATE TABLE IF NOT EXISTS waitlist_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  locale TEXT,
  source TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_by_n8n BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Index pour optimiser les requêtes n8n
CREATE INDEX IF NOT EXISTS idx_waitlist_processed ON waitlist_entries(processed_by_n8n, created_at);
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist_entries(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_source ON waitlist_entries(source);

-- RLS (Row Level Security) - optionnel pour sécuriser
ALTER TABLE waitlist_entries ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre les insertions depuis l'API
CREATE POLICY "Allow API inserts" ON waitlist_entries
  FOR INSERT WITH CHECK (true);

-- Politique pour permettre la lecture depuis n8n (avec service role)
CREATE POLICY "Allow service role access" ON waitlist_entries
  FOR ALL USING (true);
