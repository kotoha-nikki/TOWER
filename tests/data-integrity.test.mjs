import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const floors = JSON.parse(await readFile("data/floors.json", "utf8"));
const categories = JSON.parse(await readFile("data/categories.json", "utf8"));
const tenants = JSON.parse(await readFile("data/tenants.json", "utf8"));

test("floor registry exposes exactly 23 public floors", () => {
  assert.equal(floors.length, 23);
  assert.deepEqual(
    floors.map((floor) => floor.floorNumber).sort((a, b) => a - b),
    Array.from({ length: 23 }, (_, index) => index + 1)
  );
});

test("tenant slugs are unique and route-safe", () => {
  const slugs = tenants.map((tenant) => tenant.slug);
  assert.equal(new Set(slugs).size, slugs.length);

  for (const slug of slugs) {
    assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  }
});

test("tenants reference known floors and categories", () => {
  const floorNumbers = new Set(floors.map((floor) => floor.floorNumber));
  const categoryLabels = new Set(categories.map((category) => category.label));

  for (const tenant of tenants) {
    assert.ok(floorNumbers.has(tenant.floor), `${tenant.slug} has an unknown floor`);
    assert.ok(categoryLabels.has(tenant.category), `${tenant.slug} has an unknown category`);
    assert.ok(tenant.heat >= 0 && tenant.heat <= 100, `${tenant.slug} heat is out of range`);
  }
});

test("registry keeps contract verification explicit", () => {
  const allowedStatuses = new Set(["verified", "pending-verification", "not-applicable"]);

  for (const tenant of tenants) {
    assert.ok(
      allowedStatuses.has(tenant.contractStatus),
      `${tenant.slug} has unknown contract status`
    );
  }
});
