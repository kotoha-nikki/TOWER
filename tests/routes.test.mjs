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
  const tenantNotesSchema = await readFile("supabase/tenant-notes.sql", "utf8");

  assert.ok(files.includes("wallet-identity.sql"));
  assert.ok(files.includes("tenant-saves.sql"));
  assert.ok(files.includes("tenant-notes.sql"));
  assert.ok(tenantNotesSchema.includes("moderation_actions"));
});

test("moderation workflow documentation and issue template are present", async () => {
  const docs = await readdir("docs");
  const issueTemplates = await readdir(".github/ISSUE_TEMPLATE");
  const readme = await readFile("README.md", "utf8");

  assert.ok(docs.includes("moderation.md"));
  assert.ok(docs.includes("community-guidelines.md"));
  assert.ok(issueTemplates.includes("content_report.yml"));
  assert.ok(readme.includes("## Moderation Model"));
});
