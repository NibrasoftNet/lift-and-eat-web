import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const Env = createEnv({
  client: {
    NEXT_PUBLIC_APP_URL: z.string().optional(),
    NEXT_PUBLIC_API_URL: z.string().optional(),
    NEXT_PUBLIC_LOGO_PATH: z.string().optional(),
  },
  shared: {
    NODE_ENV: z.enum(['test', 'development', 'production']).optional(),
  },
  server: {
    WAITLIST_WEBHOOK_URL: z.string().url().optional(),
    WAITLIST_WEBHOOK_SECRET: z.string().optional(),
    SUPABASE_URL: z.string().url().optional(),
    SUPABASE_ANON_KEY: z.string().optional(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  },
  // You need to destructure all the keys manually
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_LOGO_PATH: process.env.NEXT_PUBLIC_LOGO_PATH,
    NODE_ENV: process.env.NODE_ENV,
    WAITLIST_WEBHOOK_URL: process.env.WAITLIST_WEBHOOK_URL,
    WAITLIST_WEBHOOK_SECRET: process.env.WAITLIST_WEBHOOK_SECRET,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
});
