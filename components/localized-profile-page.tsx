import Link from "next/link";
import { notFound } from "next/navigation";
import { TenantSaveControl } from "@/components/tenant-save-control";
import { getDictionary, type Locale } from "@/lib/i18n";
import { getFloorByNumber, getTenantBySlug } from "@/lib/tower-data";

type LocalizedTenantProfilePageProps = {
  slug: string;
  locale: Locale;
  routePrefix?: "" | "/en" | "/ja";
};

export function LocalizedTenantProfilePage({
  slug,
  locale,
  routePrefix = ""
}: LocalizedTenantProfilePageProps) {
  const dictionary = getDictionary(locale);
  const tenant = getTenantBySlug(slug);

  if (!tenant) {
    notFound();
  }

  const floor = getFloorByNumber(tenant.floor);
  const floorLabel = floor
    ? dictionary.floorLabels[floor.floorNumber] ?? floor.label
    : undefined;
  const categoryLabel = dictionary.categoryLabels[tenant.category] ?? tenant.category;

  return (
    <main className="page-shell profile-shell">
      <Link className="back-link" href={routePrefix || "/"}>
        {dictionary.profile.back}
      </Link>

      <section className="profile-hero">
        <p className="eyebrow">
          {dictionary.profile.eyebrow} / {dictionary.tower.floorLabel} {tenant.floor} /{" "}
          {floorLabel}
        </p>
        <div className="profile-title-row">
          <h1>{tenant.name}</h1>
          <span>{tenant.ticker}</span>
        </div>
        <TenantSaveControl tenantSlug={tenant.slug} locale={locale} />
        <p>{tenant.description}</p>
        {locale === "ja" ? <p className="fallback-note">{dictionary.fallback.note}</p> : null}
      </section>

      <section className="quote-panel">
        <p className="eyebrow">{dictionary.profile.curatorNote}</p>
        <blockquote>{dictionary.profile.curatorBody}</blockquote>
      </section>

      <section className="metric-grid">
        <article>
          <span>{dictionary.profile.category}</span>
          <strong>{categoryLabel}</strong>
        </article>
        <article>
          <span>{dictionary.profile.heat}</span>
          <strong>{tenant.heat}/100</strong>
        </article>
        <article>
          <span>{dictionary.profile.marketCapTier}</span>
          <strong>{tenant.marketCapTier}</strong>
        </article>
        <article>
          <span>{dictionary.profile.liquidityTier}</span>
          <strong>{tenant.poolTier}</strong>
        </article>
      </section>

      <section className="profile-details">
        <article>
          <p className="eyebrow">{dictionary.profile.contractStatus}</p>
          <h2>{tenant.contractStatus}</h2>
          <p>{dictionary.profile.contractStatusBody}</p>
        </article>
        <article>
          <p className="eyebrow">{dictionary.profile.interactionLayer}</p>
          <h2>{dictionary.profile.comingLater}</h2>
          <p>{dictionary.profile.interactionBody}</p>
        </article>
      </section>
    </main>
  );
}
