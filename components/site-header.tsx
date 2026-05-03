"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDictionary, getPathLocale, withLocale } from "@/lib/i18n";
import { WalletIdentity } from "@/components/wallet-identity";

export function SiteHeader() {
  const pathname = usePathname();
  const locale = getPathLocale(pathname);
  const dictionary = getDictionary(locale);
  const routePrefix =
    pathname === "/ja" || pathname.startsWith("/ja/")
      ? "/ja"
      : pathname === "/en" || pathname.startsWith("/en/")
        ? "/en"
        : "";
  const towerHref = routePrefix || "/";
  const methodologyHref = `${routePrefix}/methodology`;

  return (
    <header className="site-header">
      <Link className="brand" href={towerHref}>
        <span>TWR</span>
        Tower Map
      </Link>
      <nav aria-label="Primary navigation">
        <Link href={towerHref}>{dictionary.nav.tower}</Link>
        <Link href={methodologyHref}>{dictionary.nav.methodology}</Link>
        <a href="https://github.com/kotoha-nikki/TOWER" target="_blank" rel="noreferrer">
          {dictionary.nav.github}
        </a>
      </nav>
      <div className="header-actions">
        <WalletIdentity locale={locale} />
        <div className="language-switcher" aria-label="Language switcher">
          <Link className={locale === "en" ? "active-locale" : ""} href={withLocale(pathname, "en")}>
            EN
          </Link>
          <Link className={locale === "ja" ? "active-locale" : ""} href={withLocale(pathname, "ja")}>
            JP
          </Link>
        </div>
      </div>
    </header>
  );
}
