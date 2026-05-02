import categoriesJson from "@/data/categories.json";
import floorsJson from "@/data/floors.json";
import tenantsJson from "@/data/tenants.sample.json";

export type Floor = {
  floorNumber: number;
  slug: string;
  label: string;
  tier: "penthouse" | "upper" | "mid" | "lower" | "lobby";
  narrative: string;
  signalBands: string[];
  primaryCategories: string[];
};

export type Category = {
  id: string;
  label: string;
  description: string;
  defaultFloorRange: [number, number];
  accent: string;
};

export type Tenant = {
  slug: string;
  name: string;
  ticker: string;
  floor: number;
  category: string;
  description: string;
  heat: number;
  marketCapTier: "Mega" | "Large" | "Mid-Large" | "Mid" | "Small-Mid" | "Emerging" | "Micro";
  poolTier: "Large" | "Medium" | "Small" | "Unknown";
  coingeckoId?: string;
  contractAddress: string | null;
  contractStatus: "verified" | "pending-verification" | "not-applicable";
  sources: string[];
};

export const floors = [...(floorsJson as Floor[])].sort(
  (a, b) => b.floorNumber - a.floorNumber
);

export const categories = categoriesJson as Category[];

export const tenants = tenantsJson as Tenant[];

export function getTenantBySlug(slug: string) {
  return tenants.find((tenant) => tenant.slug === slug);
}

export function getFloorByNumber(floorNumber: number) {
  return floors.find((floor) => floor.floorNumber === floorNumber);
}
