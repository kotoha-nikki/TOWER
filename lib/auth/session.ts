import { createHmac, timingSafeEqual } from "crypto";

export const SESSION_COOKIE_NAME = "tower_session";

export type WalletSession = {
  userId: string;
  walletAddress: string;
  issuedAt: string;
  expiresAt: string;
};

function base64UrlEncode(value: string | Buffer) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  return Buffer.from(padded, "base64").toString("utf8");
}

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be set to at least 32 characters.");
  }

  return secret;
}

function signPayload(encodedPayload: string) {
  return base64UrlEncode(createHmac("sha256", getSessionSecret()).update(encodedPayload).digest());
}

export function createSessionToken(session: WalletSession) {
  const encodedPayload = base64UrlEncode(JSON.stringify(session));
  return `${encodedPayload}.${signPayload(encodedPayload)}`;
}

export function readSessionToken(token: string | undefined): WalletSession | null {
  if (!token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(encodedPayload);
  const actual = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return null;
  }

  let payload: WalletSession;

  try {
    payload = JSON.parse(base64UrlDecode(encodedPayload)) as WalletSession;
  } catch {
    return null;
  }

  if (Date.parse(payload.expiresAt) <= Date.now()) {
    return null;
  }

  return payload;
}

export function readSessionFromCookieHeader(cookieHeader: string | null) {
  const token = (cookieHeader ?? "")
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE_NAME}=`))
    ?.slice(SESSION_COOKIE_NAME.length + 1);

  return readSessionToken(token ? decodeURIComponent(token) : undefined);
}

export function getSessionTtlSeconds() {
  const configured = Number(process.env.AUTH_SESSION_TTL_SECONDS ?? 60 * 60 * 24 * 7);
  return Number.isFinite(configured) && configured > 0 ? configured : 60 * 60 * 24 * 7;
}

export function getSessionCookieOptions(expiresAt: string) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiresAt)
  };
}
