import { NextResponse } from "next/server";
import { readSessionFromCookieHeader } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const session = readSessionFromCookieHeader(request.headers.get("cookie"));

  if (!session) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  return NextResponse.json({ authenticated: true, user: session });
}
