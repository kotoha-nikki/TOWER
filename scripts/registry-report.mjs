import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const floors = await readJson("data/floors.json");
const categories = await readJson("data/categories.json");
const tenants = await readJson("data/tenants.json");

const generatedAt = new Date().toISOString();
const tenantsByFloor = countBy(tenants, "floor");
const tenantsByCategory = countBy(tenants, "category");
const contractStatus = countBy(tenants, "contractStatus");
const duplicateTickers = findDuplicates(tenants.map((tenant) => tenant.ticker.toUpperCase()));
const emptyFloors = floors
  .filter((floor) => !tenantsByFloor[String(floor.floorNumber)])
  .map((floor) => floor.floorNumber);
const averageTenantsPerFloor = tenants.length / floors.length;
const overcrowdedThreshold = Math.ceil(averageTenantsPerFloor * 1.6);
const overcrowdedFloors = floors
  .map((floor) => ({
    floorNumber: floor.floorNumber,
    label: floor.label,
    tenantCount: tenantsByFloor[String(floor.floorNumber)] ?? 0
  }))
  .filter((floor) => floor.tenantCount >= overcrowdedThreshold)
  .sort((first, second) => second.tenantCount - first.tenantCount);
const categoryCoverage = categories.map((category) => ({
  id: category.id,
  label: category.label,
  tenantCount: tenantsByCategory[category.label] ?? 0,
  defaultFloorRange: category.defaultFloorRange
}));
const floorOccupancy = floors
  .map((floor) => ({
    floorNumber: floor.floorNumber,
    slug: floor.slug,
    label: floor.label,
    tier: floor.tier,
    tenantCount: tenantsByFloor[String(floor.floorNumber)] ?? 0
  }))
  .sort((first, second) => second.floorNumber - first.floorNumber);

const report = {
  generatedAt,
  registry: {
    tenantCount: tenants.length,
    floorCount: floors.length,
    categoryCount: categories.length,
    averageTenantsPerFloor: Number(averageTenantsPerFloor.toFixed(2)),
    overcrowdedThreshold
  },
  floorOccupancy,
  categoryCoverage,
  contractStatus,
  duplicateTickers,
  emptyFloors,
  overcrowdedFloors,
  reviewFlags: {
    hasEmptyFloors: emptyFloors.length > 0,
    hasOvercrowdedFloors: overcrowdedFloors.length > 0,
    hasDuplicateTickers: duplicateTickers.length > 0,
    pendingContractCount: contractStatus["pending-verification"] ?? 0,
    verifiedContractCount: contractStatus.verified ?? 0
  }
};

await mkdir(path.join(root, "reports"), { recursive: true });
await writeFile(
  path.join(root, "reports/registry-summary.json"),
  `${JSON.stringify(report, null, 2)}\n`
);

console.log(
  [
    "Registry report written: reports/registry-summary.json",
    `Tenants: ${report.registry.tenantCount}`,
    `Floors: ${report.registry.floorCount}`,
    `Categories: ${report.registry.categoryCount}`,
    `Pending CA: ${report.reviewFlags.pendingContractCount}`,
    `Verified CA: ${report.reviewFlags.verifiedContractCount}`,
    `Duplicate tickers: ${report.duplicateTickers.length}`,
    `Overcrowded floors: ${report.overcrowdedFloors.length}`
  ].join("\n")
);

async function readJson(relativePath) {
  const file = path.join(root, relativePath);
  return JSON.parse(await readFile(file, "utf8"));
}

function countBy(rows, key) {
  return rows.reduce((counts, row) => {
    const value = String(row[key] ?? "unknown");
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function findDuplicates(values) {
  const counts = values.reduce((accumulator, value) => {
    accumulator[value] = (accumulator[value] ?? 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(counts)
    .filter(([, count]) => count > 1)
    .map(([value, count]) => ({ value, count }))
    .sort((first, second) => second.count - first.count || first.value.localeCompare(second.value));
}
