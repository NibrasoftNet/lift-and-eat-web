import { createClient } from '@supabase/supabase-js';
import { Env } from './Env';

// Client pour l'API côté serveur (avec service role key)
export function createSupabaseServerClient() {
  const supabaseUrl = Env.SUPABASE_URL;
  const supabaseServiceKey = Env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Types pour la table waitlist_entries
export interface WaitlistEntry {
  id?: string;
  email: string;
  locale?: string;
  source?: string;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
  processed_by_n8n?: boolean;
  processed_at?: string;
}
