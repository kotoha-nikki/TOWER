import { LocalizedHomePage } from "@/components/localized-home-page";

export const metadata = {
  title: "Tower Map",
  description:
    "An editorial high-rise map for tracking signal, culture, and market gravity across the Solana ecosystem."
};

export default function EnglishHomePage() {
  return <LocalizedHomePage locale="en" routePrefix="/en" />;
}
