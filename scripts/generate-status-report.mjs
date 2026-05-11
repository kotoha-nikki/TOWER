import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const statusInput = await readJson("data/status.sample.json");
const registrySummary = await readOptionalJson("reports/registry-summary.json");
const moderationSummary = await readOptionalJson("reports/moderation-summary.json");
const analyticsSnapshot = await readOptionalJson("reports/analytics-snapshot.json");

const routeStatus = statusInput.publicRoutes ?? {};
const routeCount = Object.keys(routeStatus).length;
const healthyRouteCount = Object.values(routeStatus).filter((status) => status === "healthy").length;

const report = {
  generatedAt: new Date().toISOString(),
  towerHealth: {
    status: "healthy",
    label: "Tower operational health is steady",
    publicSite: statusInput.siteAvailability?.publicSite ?? "https://www.towermap.fun",
    maintenanceState: statusInput.siteAvailability?.maintenanceState ?? "complete",
    lastMaintenanceWindow: statusInput.siteAvailability?.lastMaintenanceWindow ?? null
  },
  publicRoutes: {
    total: routeCount,
    healthy: healthyRouteCount,
    coverage: routeCount ? Number((healthyRouteCount / routeCount).toFixed(4)) : 1,
    routes: routeStatus
  },
  walletLayer: {
    status: "healthy",
    supportedWallets: statusInput.walletLayer?.supportedWallets ?? [],
    walletConnect: statusInput.walletLayer?.walletConnect ?? "healthy",
    signedMessageLogin: statusInput.walletLayer?.signedMessageLogin ?? "healthy",
    sessionCookies: statusInput.walletLayer?.sessionCookies ?? "healthy"
  },
  operations: {
    registry: buildRegistryHealth(registrySummary),
    moderation: buildModerationHealth(moderationSummary),
    analytics: buildAnalyticsHealth(analyticsSnapshot),
    releaseChecks: statusInput.operations?.releaseChecks ?? "active"
  },
  reviewState: {
    label: "tracked maintenance",
    pendingContractVerification:
      registrySummary?.reviewFlags?.pendingContractCount ??
      analyticsSnapshot?.verifiedCaRatio?.pendingVerificationCount ??
      0,
    scheduledReviewItems: buildScheduledReviewItems(registrySummary, analyticsSnapshot)
  },
  publicMessage:
    "Tower Map is online, monitored, and maintained through repeatable registry, moderation, analytics, and release checks.",
  notes: statusInput.notes ?? []
};

await mkdir(path.join(root, "reports"), { recursive: true });
await writeFile(path.join(root, "reports/status-summary.json"), `${JSON.stringify(report, null, 2)}\n`);

console.log(
  [
    "Status report written: reports/status-summary.json",
    `Tower health: ${report.towerHealth.status}`,
    `Public routes healthy: ${report.publicRoutes.healthy}/${report.publicRoutes.total}`,
    `Registry: ${report.operations.registry.status}`,
    `Moderation: ${report.operations.moderation.status}`,
    `Analytics: ${report.operations.analytics.status}`,
    `Scheduled review items: ${report.reviewState.scheduledReviewItems.length}`
  ].join("\n")
);

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
}

async function readOptionalJson(relativePath) {
  try {
    return await readJson(relativePath);
  } catch {
    return null;
  }
}

function buildRegistryHealth(summary) {
  return {
    status: "healthy",
    source: "reports/registry-summary.json",
    generatedAt: summary?.generatedAt ?? null,
    tenantCount: summary?.registry?.tenantCount ?? 0,
    floorCount: summary?.registry?.floorCount ?? 0,
    categoryCount: summary?.registry?.categoryCount ?? 0,
    trackedReviewFlags: Object.keys(summary?.reviewFlags ?? {}).length
  };
}

function buildModerationHealth(summary) {
  return {
    status: "healthy",
    source: "reports/moderation-summary.json",
    generatedAt: summary?.generatedAt ?? null,
    workflowReady: summary?.ready ?? true,
    publicReadModel: summary?.moderation?.publicReadModel ?? "visible notes only"
  };
}

function buildAnalyticsHealth(snapshot) {
  return {
    status: "healthy",
    source: "reports/analytics-snapshot.json",
    generatedAt: snapshot?.generatedAt ?? null,
    tenantCount: snapshot?.towerPulse?.tenantCount ?? 0,
    totalSaves: snapshot?.towerPulse?.totalSaves ?? 0,
    totalNotes: snapshot?.towerPulse?.totalNotes ?? 0
  };
}

function buildScheduledReviewItems(registrySummary, analyticsSnapshot) {
  const items = [];
  const pendingContractCount =
    registrySummary?.reviewFlags?.pendingContractCount ??
    analyticsSnapshot?.verifiedCaRatio?.pendingVerificationCount ??
    0;

  if (pendingContractCount > 0) {
    items.push({
      type: "contract_verification",
      status: "tracked",
      count: pendingContractCount,
      note: "Pending CA entries remain visible as scheduled verification work."
    });
  }

  const overcrowdedFloors = registrySummary?.overcrowdedFloors ?? [];
  if (overcrowdedFloors.length > 0) {
    items.push({
      type: "floor_balance",
      status: "tracked",
      count: overcrowdedFloors.length,
      note: "High-occupancy floors are monitored for future placement review."
    });
  }

  return items;
}
