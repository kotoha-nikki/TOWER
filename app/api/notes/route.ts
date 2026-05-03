import { NextResponse } from "next/server";
import { readSessionFromCookieHeader } from "@/lib/auth/session";
import { getSupabaseAdmin } from "@/lib/auth/supabase-admin";
import { getTenantBySlug } from "@/lib/tower-data";

export const runtime = "nodejs";

const MAX_NOTE_LENGTH = 480;
const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMIT_MAX_NOTES = 3;

type TenantNoteRow = {
  id: string;
  tenant_slug: string;
  wallet_address: string;
  body: string;
  created_at: string;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tenantSlug = url.searchParams.get("tenantSlug")?.trim();
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 30), 50);

  if (!tenantSlug || !getTenantBySlug(tenantSlug)) {
    return NextResponse.json({ error: "Unknown tenant." }, { status: 404 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("tenant_notes")
      .select("id, tenant_slug, wallet_address, body, created_at")
      .eq("tenant_slug", tenantSlug)
      .eq("status", "visible")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(Number.isFinite(limit) && limit > 0 ? limit : 30);

    if (error) {
      return NextResponse.json({ error: "Could not read tenant notes." }, { status: 500 });
    }

    const notes = ((data ?? []) as TenantNoteRow[]).map(formatNote);

    return NextResponse.json({
      tenantSlug,
      notes,
      count: notes.length
    });
  } catch {
    return NextResponse.json({ error: "Tenant notes storage is not configured." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = readOptionalSession(request);

  if (!session) {
    return NextResponse.json({ error: "Wallet login required." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const tenantSlug = typeof body?.tenantSlug === "string" ? body.tenantSlug.trim() : "";
  const noteBody = typeof body?.body === "string" ? normalizeNoteBody(body.body) : "";

  if (!tenantSlug || !getTenantBySlug(tenantSlug)) {
    return NextResponse.json({ error: "Unknown tenant." }, { status: 404 });
  }

  if (!noteBody) {
    return NextResponse.json({ error: "Note cannot be empty." }, { status: 400 });
  }

  if (noteBody.length > MAX_NOTE_LENGTH) {
    return NextResponse.json(
      { error: `Note must be ${MAX_NOTE_LENGTH} characters or fewer.` },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabaseAdmin();
    const rateLimited = await isRateLimited(supabase, session.userId);

    if (rateLimited) {
      return NextResponse.json(
        { error: "Please wait before posting another note." },
        { status: 429 }
      );
    }

    const { data, error } = await supabase
      .from("tenant_notes")
      .insert({
        user_id: session.userId,
        wallet_address: session.walletAddress,
        tenant_slug: tenantSlug,
        body: noteBody,
        status: "visible"
      })
      .select("id, tenant_slug, wallet_address, body, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: "Could not create tenant note." }, { status: 500 });
    }

    return NextResponse.json({
      tenantSlug,
      note: formatNote(data as TenantNoteRow)
    });
  } catch {
    return NextResponse.json({ error: "Tenant notes storage is not configured." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = readOptionalSession(request);

  if (!session) {
    return NextResponse.json({ error: "Wallet login required." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const noteId = typeof body?.noteId === "string" ? body.noteId.trim() : "";

  if (!noteId) {
    return NextResponse.json({ error: "Missing note id." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("tenant_notes")
      .update({
        status: "deleted",
        deleted_at: new Date().toISOString()
      })
      .eq("id", noteId)
      .eq("user_id", session.userId);

    if (error) {
      return NextResponse.json({ error: "Could not delete tenant note." }, { status: 500 });
    }

    return NextResponse.json({ noteId, deleted: true });
  } catch {
    return NextResponse.json({ error: "Tenant notes storage is not configured." }, { status: 500 });
  }
}

function readOptionalSession(request: Request) {
  try {
    return readSessionFromCookieHeader(request.headers.get("cookie"));
  } catch {
    return null;
  }
}

function normalizeNoteBody(body: string) {
  return body.replace(/\s+/g, " ").trim();
}

async function isRateLimited(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  userId: string
) {
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_SECONDS * 1000).toISOString();
  const { count, error } = await supabase
    .from("tenant_notes")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", since);

  if (error) {
    return true;
  }

  return (count ?? 0) >= RATE_LIMIT_MAX_NOTES;
}

function formatNote(note: TenantNoteRow) {
  return {
    id: note.id,
    tenantSlug: note.tenant_slug,
    walletAddress: note.wallet_address,
    walletLabel: shortenWallet(note.wallet_address),
    body: note.body,
    createdAt: note.created_at
  };
}

function shortenWallet(walletAddress: string) {
  if (walletAddress.length <= 12) {
    return walletAddress;
  }

  return `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`;
}
