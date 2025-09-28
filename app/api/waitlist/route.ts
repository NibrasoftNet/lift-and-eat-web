import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient, WaitlistEntry } from "@/libs/supabase";

// In-memory rate limiting (per runtime instance)
const requestsByIp = new Map<string, number[]>();
const recentEmails = new Map<string, number>(); // email -> timestamp

const BODY_SCHEMA = z.object({
  email: z.string().email().max(320),
  locale: z.string().optional(),
  source: z.string().optional(),
});

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const LIMITS = {
  perMinute: 1,
  perHour: 20,
};

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "yopmail.com",
  "guerrillamail.com",
  "10minutemail.com",
  "temp-mail.io",
  "trashmail.com",
  "tempmail.com",
  "burnermail.io",
]);

function getClientIp(req: NextRequest) {
  const fwd = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    fwd ||
    (req as any).ip ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isDisposable(email: string) {
  const domain = email.split("@")[1]?.toLowerCase();
  return !!domain && DISPOSABLE_DOMAINS.has(domain);
}

function rateLimit(ip: string) {
  const now = Date.now();
  const list = requestsByIp.get(ip) || [];
  // keep last hour
  const recent = list.filter((t) => now - t < HOUR);
  // check windows
  const perMinuteCount = recent.filter((t) => now - t < MINUTE).length;
  const perHourCount = recent.length;

  if (perMinuteCount >= LIMITS.perMinute) {
    return { ok: false, reason: "too many per minute" } as const;
  }
  if (perHourCount >= LIMITS.perHour) {
    return { ok: false, reason: "too many per hour" } as const;
  }

  recent.push(now);
  requestsByIp.set(ip, recent);
  return { ok: true } as const;
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // Rate limit
    const rl = rateLimit(ip);
    if (!rl.ok) {
      return NextResponse.json({ ok: false, message: rl.reason }, { status: 429 });
    }

    const json = await req.json();
    const parsed = BODY_SCHEMA.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, message: "invalid body" }, { status: 400 });
    }

    const { email, locale, source } = parsed.data;

    // Disposable email filter
    if (isDisposable(email)) {
      return NextResponse.json({ ok: false, message: "disposable email" }, { status: 400 });
    }

    // Soft de-duplicate within 12 hours
    const now = Date.now();
    const last = recentEmails.get(email) || 0;
    if (now - last < 12 * HOUR) {
      return NextResponse.json({ ok: true, message: "already registered" });
    }

    // Create Supabase client
    let supabase;
    try {
      supabase = createSupabaseServerClient();
    } catch (error) {
      return NextResponse.json({ 
        ok: false, 
        message: "server not configured: missing Supabase credentials" 
      }, { status: 500 });
    }

    const userAgent = req.headers.get("user-agent") || null;
    const payload = {
      email,
      locale: locale || 'en',
      source: source || 'unknown',
      ip_address: ip === "unknown" ? null : ip,
      user_agent: userAgent,
      created_at: new Date().toISOString(),
    };

    // Insert into Supabase
    const { data, error } = await supabase
      .from('waitlist_entries')
      .insert([payload])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ 
        ok: false, 
        message: "database error" 
      }, { status: 500 });
    }

    recentEmails.set(email, now);
    return NextResponse.json({ 
      ok: true, 
      message: "saved",
      id: data?.[0]?.id 
    });

  } catch (e: any) {
    console.error('API error:', e);
    return NextResponse.json({ 
      ok: false, 
      message: e?.message || "error" 
    }, { status: 500 });
  }
}
