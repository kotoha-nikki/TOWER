import categoriesJson from "@/data/categories.json";
import floorsJson from "@/data/floors.json";
import tenantsJson from "@/data/tenants.json";

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
  sourceCategory?: string;
  description: string;
  descriptionTokens?: Record<string, string | number> | null;
  heat: number;
  marketCapTier:
    | "Mega"
    | "Large"
    | "Mid-Large"
    | "Medium"
    | "Mid"
    | "Small-Mid"
    | "Small"
    | "Emerging"
    | "Micro";
  poolTier: "Large" | "Medium" | "Small" | "Unknown";
  change24h?: number | null;
  direction?: "up" | "down" | "flat" | null;
  coingeckoId?: string | null;
  contractAddress: string | null;
  contractStatus: "verified" | "pending-verification" | "not-applicable";
  sourceFloorName?: string;
  sourceUrl?: string;
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
