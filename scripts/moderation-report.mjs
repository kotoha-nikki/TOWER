import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const files = {
  moderationDoc: "docs/moderation.md",
  guidelinesDoc: "docs/community-guidelines.md",
  tenantNotesDoc: "docs/tenant-notes.md",
  tenantNotesSql: "supabase/tenant-notes.sql",
  contentReportTemplate: ".github/ISSUE_TEMPLATE/content_report.yml",
  readme: "README.md"
};

const contents = Object.fromEntries(
  await Promise.all(
    Object.entries(files).map(async ([key, relativePath]) => [
      key,
      await readText(relativePath)
    ])
  )
);

const requiredActions = [
  "note_review",
  "hide_note",
  "delete_note",
  "wallet_ban",
  "wallet_unban"
];
const requiredStatuses = ["visible", "hidden", "deleted"];

const checks = {
  moderationDocPresent: Boolean(contents.moderationDoc),
  communityGuidelinesPresent: Boolean(contents.guidelinesDoc),
  tenantNotesDocLinksModeration: contents.tenantNotesDoc.includes("docs/moderation.md"),
  contentReportTemplatePresent: Boolean(contents.contentReportTemplate),
  readmeMentionsModerationModel: contents.readme.includes("## Moderation Model"),
  moderationActionsTableReserved: contents.tenantNotesSql.includes("moderation_actions"),
  publicViewFiltersVisibleNotes:
    contents.tenantNotesSql.includes("status = 'visible'") &&
    contents.tenantNotesSql.includes("deleted_at is null"),
  noteStatuses: Object.fromEntries(
    requiredStatuses.map((status) => [status, contents.tenantNotesSql.includes(status)])
  ),
  moderationActions: Object.fromEntries(
    requiredActions.map((action) => [action, contents.tenantNotesSql.includes(action)])
  )
};

const reviewFlags = {
  missingDocs: Object.entries({
    moderationDoc: checks.moderationDocPresent,
    communityGuidelines: checks.communityGuidelinesPresent,
    tenantNotesDocLinksModeration: checks.tenantNotesDocLinksModeration
  })
    .filter(([, passed]) => !passed)
    .map(([name]) => name),
  missingWorkflow: Object.entries({
    contentReportTemplate: checks.contentReportTemplatePresent,
    readmeModerationModel: checks.readmeMentionsModerationModel,
    moderationActionsTable: checks.moderationActionsTableReserved,
    publicViewFilter: checks.publicViewFiltersVisibleNotes
  })
    .filter(([, passed]) => !passed)
    .map(([name]) => name),
  missingStatuses: Object.entries(checks.noteStatuses)
    .filter(([, passed]) => !passed)
    .map(([status]) => status),
  missingActions: Object.entries(checks.moderationActions)
    .filter(([, passed]) => !passed)
    .map(([action]) => action)
};

const report = {
  generatedAt: new Date().toISOString(),
  moderation: {
    scope: "Tenant Notes",
    publicReadModel: "visible notes only",
    reportTemplate: files.contentReportTemplate,
    reservedActionTable: "public.moderation_actions"
  },
  checks,
  reviewFlags,
  ready:
    reviewFlags.missingDocs.length === 0 &&
    reviewFlags.missingWorkflow.length === 0 &&
    reviewFlags.missingStatuses.length === 0 &&
    reviewFlags.missingActions.length === 0
};

await mkdir(path.join(root, "reports"), { recursive: true });
await writeFile(
  path.join(root, "reports/moderation-summary.json"),
  `${JSON.stringify(report, null, 2)}\n`
);

console.log(
  [
    "Moderation report written: reports/moderation-summary.json",
    `Ready: ${report.ready}`,
    `Missing docs: ${reviewFlags.missingDocs.length}`,
    `Missing workflow checks: ${reviewFlags.missingWorkflow.length}`,
    `Missing note statuses: ${reviewFlags.missingStatuses.length}`,
    `Missing moderation actions: ${reviewFlags.missingActions.length}`
  ].join("\n")
);

async function readText(relativePath) {
  try {
    return await readFile(path.join(root, relativePath), "utf8");
  } catch {
    return "";
  }
}
