import { NextResponse } from "next/server";
import { readSessionFromCookieHeader } from "@/lib/auth/session";
import { getSupabaseAdmin } from "@/lib/auth/supabase-admin";
import { getTenantBySlug } from "@/lib/tower-data";

export const runtime = "nodejs";

type FavoriteRow = {
  tenant_slug: string;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tenantSlug = url.searchParams.get("tenantSlug")?.trim();
  const session = readOptionalSession(request);

  try {
    const supabase = getSupabaseAdmin();

    if (tenantSlug) {
      if (!getTenantBySlug(tenantSlug)) {
        return NextResponse.json({ error: "Unknown tenant." }, { status: 404 });
      }

      const { count, error: countError } = await supabase
        .from("tenant_saves")
        .select("id", { count: "exact", head: true })
        .eq("tenant_slug", tenantSlug);

      if (countError) {
        return NextResponse.json({ error: "Could not read save count." }, { status: 500 });
      }

      const saved = session ? await readSavedState(session.userId, tenantSlug) : false;

      return NextResponse.json({
        tenantSlug,
        count: count ?? 0,
        saved,
        authenticated: Boolean(session)
      });
    }

    const { data, error } = await supabase.from("tenant_saves").select("tenant_slug");

    if (error) {
      return NextResponse.json({ error: "Could not read save counts." }, { status: 500 });
    }

    const favoriteRows = (data ?? []) as FavoriteRow[];
    const counts = favoriteRows.reduce<Record<string, number>>((accumulator, row) => {
      accumulator[row.tenant_slug] = (accumulator[row.tenant_slug] ?? 0) + 1;
      return accumulator;
    }, {});
    const savedSlugs = session ? await readSavedSlugs(session.userId) : [];

    return NextResponse.json({
      counts,
      savedSlugs,
      authenticated: Boolean(session)
    });
  } catch {
    return NextResponse.json({ error: "Favorites storage is not configured." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = readOptionalSession(request);

  if (!session) {
    return NextResponse.json({ error: "Wallet login required." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const tenantSlug = typeof body?.tenantSlug === "string" ? body.tenantSlug.trim() : "";
  const shouldSave =
    typeof body?.saved === "boolean"
      ? body.saved
      : body?.action === "save"
        ? true
        : body?.action === "unsave"
          ? false
          : null;

  if (!tenantSlug || !getTenantBySlug(tenantSlug)) {
    return NextResponse.json({ error: "Unknown tenant." }, { status: 404 });
  }

  if (shouldSave === null) {
    return NextResponse.json({ error: "Missing save action." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();

    if (shouldSave) {
      const { error } = await supabase.from("tenant_saves").upsert(
        {
          user_id: session.userId,
          wallet_address: session.walletAddress,
          tenant_slug: tenantSlug
        },
        { onConflict: "user_id,tenant_slug" }
      );

      if (error) {
        return NextResponse.json({ error: "Could not save tenant." }, { status: 500 });
      }
    } else {
      const { error } = await supabase
        .from("tenant_saves")
        .delete()
        .eq("user_id", session.userId)
        .eq("tenant_slug", tenantSlug);

      if (error) {
        return NextResponse.json({ error: "Could not remove saved tenant." }, { status: 500 });
      }
    }

    const { count } = await supabase
      .from("tenant_saves")
      .select("id", { count: "exact", head: true })
      .eq("tenant_slug", tenantSlug);

    return NextResponse.json({
      tenantSlug,
      saved: shouldSave,
      count: count ?? 0
    });
  } catch {
    return NextResponse.json({ error: "Favorites storage is not configured." }, { status: 500 });
  }
}

function readOptionalSession(request: Request) {
  try {
    return readSessionFromCookieHeader(request.headers.get("cookie"));
  } catch {
    return null;
  }
}

async function readSavedState(userId: string, tenantSlug: string) {
  const supabase = getSupabaseAdmin();
  const { count } = await supabase
    .from("tenant_saves")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("tenant_slug", tenantSlug);

  return Boolean(count);
}

async function readSavedSlugs(userId: string) {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("tenant_saves").select("tenant_slug").eq("user_id", userId);

  return ((data ?? []) as FavoriteRow[]).map((row) => row.tenant_slug);
}
