import { NextRequest, NextResponse } from "next/server";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";

// In-memory rate limiter: max 5 attempts per IP per 15 minutes
const RATE_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS   = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const entry = attempts.get(ip);

  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true, retryAfterSec: 0 };
  }

  entry.count++;
  if (entry.count > MAX_ATTEMPTS) {
    return { allowed: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { allowed: true, retryAfterSec: 0 };
}

// Generate a signed token: random_hex.HMAC(secret, random_hex)
function generateToken(secret: string): string {
  const payload = randomBytes(32).toString("hex");
  const sig     = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyToken(token: string, secret: string): boolean {
  const parts = token?.split(".");
  if (parts?.length !== 2) return false;
  const [payload, sig] = parts;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  // Extract real IP (works behind Vercel/nginx proxies)
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const { allowed, retryAfterSec } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez dans quelques minutes." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSec) },
      }
    );
  }

  const body = await req.json().catch(() => ({}));
  const { email, password } = body as { email?: string; password?: string };

  const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    ?? "";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
  const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? "fallback_dev_secret_32chars__ok";

  // timingSafeEqual prevents timing attacks
  const emailBuf    = Buffer.from(email    ?? "");
  const passwordBuf = Buffer.from(password ?? "");
  const adminEmailBuf    = Buffer.from(ADMIN_EMAIL);
  const adminPasswordBuf = Buffer.from(ADMIN_PASSWORD);

  const emailMatch =
    emailBuf.length === adminEmailBuf.length &&
    timingSafeEqual(emailBuf, adminEmailBuf);
  const passwordMatch =
    passwordBuf.length === adminPasswordBuf.length &&
    timingSafeEqual(passwordBuf, adminPasswordBuf);

  if (!emailMatch || !passwordMatch) {
    // Uniform response to avoid user enumeration
    return NextResponse.json(
      { error: "Identifiants administrateur incorrects." },
      { status: 401 }
    );
  }

  // Reset rate limit on success
  attempts.delete(ip);

  const token = generateToken(SESSION_SECRET);
  return NextResponse.json({ token }, { status: 200 });
}
