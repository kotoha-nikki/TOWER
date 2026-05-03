import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const floors = await readJson("data/floors.json");
const categories = await readJson("data/categories.json");
const tenants = await readJson("data/tenants.json");

const floorNumbers = new Set(floors.map((floor) => floor.floorNumber));
const categoryLabels = new Set(categories.map((category) => category.label));
const slugs = new Set();
const errors = [];

if (floors.length !== 23) {
  errors.push(`Expected 23 floors, found ${floors.length}.`);
}

for (const floor of floors) {
  if (!Number.isInteger(floor.floorNumber) || floor.floorNumber < 1 || floor.floorNumber > 23) {
    errors.push(`Invalid floor number: ${JSON.stringify(floor)}`);
  }

  for (const field of ["slug", "label", "tier", "narrative"]) {
    if (!floor[field]) {
      errors.push(`Floor ${floor.floorNumber} is missing ${field}.`);
    }
  }
}

for (const tenant of tenants) {
  if (!tenant.slug || !tenant.name || !tenant.ticker) {
    errors.push(`Tenant is missing slug, name, or ticker: ${JSON.stringify(tenant)}`);
  }

  if (slugs.has(tenant.slug)) {
    errors.push(`Duplicate tenant slug: ${tenant.slug}`);
  }
  slugs.add(tenant.slug);

  if (!floorNumbers.has(tenant.floor)) {
    errors.push(`Tenant ${tenant.slug} uses unknown floor ${tenant.floor}.`);
  }

  if (!categoryLabels.has(tenant.category)) {
    errors.push(`Tenant ${tenant.slug} uses unknown category ${tenant.category}.`);
  }

  if (!Number.isFinite(tenant.heat) || tenant.heat < 0 || tenant.heat > 100) {
    errors.push(`Tenant ${tenant.slug} has invalid heat ${tenant.heat}.`);
  }

  if (tenant.contractAddress && tenant.contractStatus === "pending-verification") {
    errors.push(`Tenant ${tenant.slug} has a CA but is still pending verification.`);
  }
}

if (errors.length) {
  console.error("Tower data validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(
  `Tower data OK: ${floors.length} floors, ${categories.length} categories, ${tenants.length} tenants.`
);

async function readJson(relativePath) {
  const file = path.join(root, relativePath);
  return JSON.parse(await readFile(file, "utf8"));
}
