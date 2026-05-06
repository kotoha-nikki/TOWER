import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const floors = await readJson("data/floors.json");
const categories = await readJson("data/categories.json");
const tenants = await readJson("data/tenants.json");
const analyticsInput = await readJson("data/analytics.sample.json");

const saveCounts = analyticsInput.tenantSaveCounts ?? {};
const noteCounts = analyticsInput.tenantNoteCounts ?? {};
const tenantsBySlug = new Map(tenants.map((tenant) => [tenant.slug, tenant]));
const floorsByNumber = new Map(floors.map((floor) => [floor.floorNumber, floor]));
const totalSaves = sumValues(saveCounts);
const totalNotes = sumValues(noteCounts);

const tenantAnalytics = tenants.map((tenant) => {
  const saveCount = Number(saveCounts[tenant.slug] ?? 0);
  const noteCount = Number(noteCounts[tenant.slug] ?? 0);

  return {
    slug: tenant.slug,
    name: tenant.name,
    ticker: tenant.ticker,
    floor: tenant.floor,
    category: tenant.category,
    heat: tenant.heat,
    saveCount,
    noteCount,
    pulseScore: tenant.heat + saveCount * 1.8 + noteCount * 2.4
  };
});

const mostSavedTenants = tenantAnalytics
  .filter((tenant) => tenant.saveCount > 0)
  .sort((first, second) => second.saveCount - first.saveCount || compareTenantNames(first, second))
  .slice(0, 10);

const mostDiscussedTenants = tenantAnalytics
  .filter((tenant) => tenant.noteCount > 0)
  .sort((first, second) => second.noteCount - first.noteCount || compareTenantNames(first, second))
  .slice(0, 10);

const hottestFloors = floors
  .map((floor) => {
    const floorTenants = tenantAnalytics.filter((tenant) => tenant.floor === floor.floorNumber);
    const tenantCount = floorTenants.length;
    const averageHeat = tenantCount
      ? floorTenants.reduce((total, tenant) => total + tenant.heat, 0) / tenantCount
      : 0;
    const saveCount = floorTenants.reduce((total, tenant) => total + tenant.saveCount, 0);
    const noteCount = floorTenants.reduce((total, tenant) => total + tenant.noteCount, 0);
    const pulseScore = averageHeat + saveCount * 1.2 + noteCount * 1.8;

    return {
      floorNumber: floor.floorNumber,
      slug: floor.slug,
      label: floor.label,
      tier: floor.tier,
      tenantCount,
      averageHeat: Number(averageHeat.toFixed(2)),
      saveCount,
      noteCount,
      pulseScore: Number(pulseScore.toFixed(2))
    };
  })
  .sort((first, second) => second.pulseScore - first.pulseScore || second.floorNumber - first.floorNumber)
  .slice(0, 10);

const categoryDistribution = categories
  .map((category) => {
    const categoryTenants = tenantAnalytics.filter((tenant) => tenant.category === category.label);
    const tenantCount = categoryTenants.length;
    const saveCount = categoryTenants.reduce((total, tenant) => total + tenant.saveCount, 0);
    const noteCount = categoryTenants.reduce((total, tenant) => total + tenant.noteCount, 0);

    return {
      id: category.id,
      label: category.label,
      tenantCount,
      registryShare: Number((tenantCount / tenants.length).toFixed(4)),
      saveCount,
      noteCount,
      defaultFloorRange: category.defaultFloorRange
    };
  })
  .sort((first, second) => second.tenantCount - first.tenantCount || first.label.localeCompare(second.label));

const verifiedCaRatio = buildVerifiedCaRatio(tenants);

const report = {
  generatedAt: new Date().toISOString(),
  source: {
    registry: "data/tenants.json",
    floors: "data/floors.json",
    categories: "data/categories.json",
    interactionExport: "data/analytics.sample.json",
    analyticsInputGeneratedAt: analyticsInput.generatedAt ?? null
  },
  towerPulse: {
    tenantCount: tenants.length,
    floorCount: floors.length,
    categoryCount: categories.length,
    totalSaves,
    totalNotes,
    tenantsWithSaves: Object.keys(saveCounts).filter((slug) => tenantsBySlug.has(slug)).length,
    tenantsWithNotes: Object.keys(noteCounts).filter((slug) => tenantsBySlug.has(slug)).length,
    hottestFloor: hottestFloors[0] ?? null,
    mostSavedTenant: mostSavedTenants[0] ?? null,
    mostDiscussedTenant: mostDiscussedTenants[0] ?? null
  },
  mostSavedTenants,
  mostDiscussedTenants,
  hottestFloors,
  categoryDistribution,
  verifiedCaRatio,
  reviewFlags: {
    unknownSaveSlugs: findUnknownSlugs(saveCounts, tenantsBySlug),
    unknownNoteSlugs: findUnknownSlugs(noteCounts, tenantsBySlug),
    emptyInteractionExport: totalSaves === 0 && totalNotes === 0,
    zeroVerifiedCa: verifiedCaRatio.verifiedCount === 0
  }
};

await mkdir(path.join(root, "reports"), { recursive: true });
await writeFile(
  path.join(root, "reports/analytics-snapshot.json"),
  `${JSON.stringify(report, null, 2)}\n`
);

console.log(
  [
    "Analytics snapshot written: reports/analytics-snapshot.json",
    `Tenants: ${report.towerPulse.tenantCount}`,
    `Total saves: ${report.towerPulse.totalSaves}`,
    `Total notes: ${report.towerPulse.totalNotes}`,
    `Most saved: ${report.towerPulse.mostSavedTenant?.name ?? "none"}`,
    `Most discussed: ${report.towerPulse.mostDiscussedTenant?.name ?? "none"}`,
    `Hottest floor: ${formatFloor(report.towerPulse.hottestFloor)}`
  ].join("\n")
);

async function readJson(relativePath) {
  const file = path.join(root, relativePath);
  return JSON.parse(await readFile(file, "utf8"));
}

function sumValues(values) {
  return Object.values(values).reduce((total, value) => total + Number(value ?? 0), 0);
}

function compareTenantNames(first, second) {
  return first.name.localeCompare(second.name) || first.slug.localeCompare(second.slug);
}

function buildVerifiedCaRatio(rows) {
  const counts = rows.reduce(
    (accumulator, tenant) => {
      accumulator[tenant.contractStatus] = (accumulator[tenant.contractStatus] ?? 0) + 1;
      return accumulator;
    },
    {
      verified: 0,
      "pending-verification": 0,
      "not-applicable": 0
    }
  );
  const total = rows.length;
  const verifiedCount = counts.verified ?? 0;

  return {
    total,
    verifiedCount,
    pendingVerificationCount: counts["pending-verification"] ?? 0,
    notApplicableCount: counts["not-applicable"] ?? 0,
    verifiedRatio: total ? Number((verifiedCount / total).toFixed(4)) : 0
  };
}

function findUnknownSlugs(counts, knownTenants) {
  return Object.keys(counts).filter((slug) => !knownTenants.has(slug)).sort();
}

function formatFloor(floor) {
  if (!floor) {
    return "none";
  }

  return `${floor.label} (FL ${floor.floorNumber})`;
}
