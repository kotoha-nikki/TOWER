import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

test("README documents the public app and API routes", async () => {
  const readme = await readFile("README.md", "utf8");

  for (const route of [
    "/en",
    "/ja",
    "/methodology",
    "/profile/[slug]",
    "/api/auth/verify",
    "/api/favorites",
    "/api/notes"
  ]) {
    assert.ok(readme.includes(route), `README is missing ${route}`);
  }
});

test("Supabase schema files are present for each interactive layer", async () => {
  const files = await readdir("supabase");

  assert.ok(files.includes("wallet-identity.sql"));
  assert.ok(files.includes("tenant-saves.sql"));
  assert.ok(files.includes("tenant-notes.sql"));
});
