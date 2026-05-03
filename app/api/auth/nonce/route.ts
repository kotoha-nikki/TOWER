import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { buildLoginMessage, getRequestDomain } from "@/lib/auth/message";
import { normalizeWalletAddress, isValidSolanaAddress } from "@/lib/auth/solana";
import { getSupabaseAdmin } from "@/lib/auth/supabase-admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const walletAddress = normalizeWalletAddress(body?.walletAddress);

  if (!isValidSolanaAddress(walletAddress)) {
    return NextResponse.json({ error: "Invalid wallet address." }, { status: 400 });
  }

  const issuedAt = new Date();
  const ttlSeconds = Number(process.env.AUTH_NONCE_TTL_SECONDS ?? 300);
  const expiresAt = new Date(issuedAt.getTime() + ttlSeconds * 1000);
  const nonce = randomBytes(16).toString("hex");
  const message = buildLoginMessage({
    domain: getRequestDomain(request),
    walletAddress,
    nonce,
    issuedAt: issuedAt.toISOString()
  });

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("wallet_login_nonces").insert({
      wallet_address: walletAddress,
      nonce,
      message,
      issued_at: issuedAt.toISOString(),
      expires_at: expiresAt.toISOString()
    });

    if (error) {
      return NextResponse.json({ error: "Could not create login nonce." }, { status: 500 });
    }

    return NextResponse.json({
      walletAddress,
      nonce,
      message,
      expiresAt: expiresAt.toISOString()
    });
  } catch {
    return NextResponse.json({ error: "Auth storage is not configured." }, { status: 500 });
  }
}
