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
  assert.ok(readme.includes("docs/moderation.md"));
  assert.ok(readme.includes("docs/community-guidelines.md"));
});

test("public analytics layer files and README section are present", async () => {
  const docs = await readdir("docs");
  const dataFiles = await readdir("data");
  const scripts = await readdir("scripts");
  const readme = await readFile("README.md", "utf8");

  assert.ok(docs.includes("analytics.md"));
  assert.ok(docs.includes("tower-pulse.md"));
  assert.ok(docs.includes("tower-pulse-implementation.md"));
  assert.ok(dataFiles.includes("analytics.sample.json"));
  assert.ok(scripts.includes("generate-analytics-snapshot.mjs"));
  assert.ok(readme.includes("docs/analytics.md"));
  assert.ok(readme.includes("Tower Pulse"));
});

test("README documents official public links", async () => {
  const readme = await readFile("README.md", "utf8");

  assert.ok(readme.includes("## Official Links"));
  assert.ok(readme.includes("https://www.towermap.fun"));
  assert.ok(readme.includes("https://x.com/TowerMapFun"));
  assert.ok(readme.includes("https://github.com/kotoha-nikki/TOWER"));
});
