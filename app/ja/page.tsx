import { LocalizedHomePage } from "@/components/localized-home-page";

export const metadata = {
  title: "Tower Map",
  description: "Solana エコシステムのシグナルを読むためのエディトリアル高層マップ。"
};

export default function JapaneseHomePage() {
  return <LocalizedHomePage locale="ja" routePrefix="/ja" />;
}
