import { NextResponse } from "next/server";
import {
  createSessionToken,
  getSessionCookieOptions,
  getSessionTtlSeconds,
  SESSION_COOKIE_NAME
} from "@/lib/auth/session";
import { isValidSolanaAddress, normalizeWalletAddress, verifyWalletSignature } from "@/lib/auth/solana";
import { getSupabaseAdmin } from "@/lib/auth/supabase-admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const walletAddress = normalizeWalletAddress(body?.walletAddress);
  const nonce = typeof body?.nonce === "string" ? body.nonce.trim() : "";
  const signature = typeof body?.signature === "string" ? body.signature.trim() : "";

  if (!isValidSolanaAddress(walletAddress) || !nonce || !signature) {
    return NextResponse.json({ error: "Invalid login payload." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data: nonceRow, error: nonceError } = await supabase
      .from("wallet_login_nonces")
      .select("id,wallet_address,nonce,message,expires_at,consumed_at")
      .eq("wallet_address", walletAddress)
      .eq("nonce", nonce)
      .is("consumed_at", null)
      .single();

    if (nonceError || !nonceRow || Date.parse(nonceRow.expires_at) <= Date.now()) {
      return NextResponse.json({ error: "Login nonce expired or not found." }, { status: 401 });
    }

    const signatureValid = verifyWalletSignature({
      message: nonceRow.message,
      signature,
      walletAddress
    });

    if (!signatureValid) {
      return NextResponse.json({ error: "Wallet signature could not be verified." }, { status: 401 });
    }

    const now = new Date().toISOString();
    const { data: user, error: userError } = await supabase
      .from("wallet_users")
      .upsert(
        {
          wallet_address: walletAddress,
          last_seen_at: now
        },
        { onConflict: "wallet_address" }
      )
      .select("id,wallet_address")
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "Could not create wallet user." }, { status: 500 });
    }

    await supabase
      .from("wallet_login_nonces")
      .update({ consumed_at: now })
      .eq("id", nonceRow.id);

    const expiresAt = new Date(Date.now() + getSessionTtlSeconds() * 1000).toISOString();
    const session = {
      userId: user.id,
      walletAddress: user.wallet_address,
      issuedAt: now,
      expiresAt
    };
    const response = NextResponse.json({
      authenticated: true,
      user: session
    });

    response.cookies.set(
      SESSION_COOKIE_NAME,
      createSessionToken(session),
      getSessionCookieOptions(expiresAt)
    );

    return response;
  } catch {
    return NextResponse.json({ error: "Auth storage is not configured." }, { status: 500 });
  }
}
