"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { Floor, Tenant } from "@/lib/tower-data";

type TowerExperienceProps = {
  floors: Floor[];
  tenants: Tenant[];
  locale: Locale;
  routePrefix?: "" | "/en" | "/ja";
};

export function TowerExperience({
  floors,
  tenants,
  locale,
  routePrefix = ""
}: TowerExperienceProps) {
  const dictionary = getDictionary(locale);
  const [selectedFloor, setSelectedFloor] = useState(23);
  const [directoryOpen, setDirectoryOpen] = useState(false);

  const activeFloor = floors.find((floor) => floor.floorNumber === selectedFloor) ?? floors[0];
  const tenantsOnFloor = useMemo(
    () => tenants.filter((tenant) => tenant.floor === selectedFloor),
    [selectedFloor, tenants]
  );

  return (
    <section className="tower-shell" aria-label={dictionary.tower.ariaLabel}>
      <div className="tower-toolbar">
        <div>
          <p className="eyebrow">{dictionary.tower.eyebrow}</p>
          <h2>{dictionary.tower.title}</h2>
        </div>
        <button type="button" onClick={() => setDirectoryOpen(true)}>
          {dictionary.tower.openDirectory}
        </button>
      </div>

      <div className="tower-grid">
        <div className="tower-visual">
          <img src="/banner.png" alt={dictionary.tower.imageAlt} />
          <div className="floor-rail" aria-label={dictionary.tower.floorSelector}>
            {floors.map((floor) => (
              <button
                key={floor.floorNumber}
                type="button"
                className={floor.floorNumber === selectedFloor ? "active" : ""}
                onClick={() => setSelectedFloor(floor.floorNumber)}
                aria-pressed={floor.floorNumber === selectedFloor}
              >
                <span>FL {floor.floorNumber}</span>
              </button>
            ))}
          </div>
        </div>

        <aside className="floor-panel">
          <p className="eyebrow">
            {dictionary.tower.floorLabel} {activeFloor.floorNumber}
          </p>
          <h2>{dictionary.floorLabels[activeFloor.floorNumber] ?? activeFloor.label}</h2>
          <p>{activeFloor.narrative}</p>
          {locale === "ja" ? <p className="fallback-note">{dictionary.fallback.note}</p> : null}

          <div className="signal-row">
            {activeFloor.signalBands.map((signal) => (
              <span key={signal}>{signal}</span>
            ))}
          </div>

          <div className="tenant-list">
            <div className="tenant-list-heading">
              <span>{dictionary.tower.tenantsLabel}</span>
              <strong>{tenantsOnFloor.length}</strong>
            </div>
            {tenantsOnFloor.length > 0 ? (
              tenantsOnFloor.map((tenant) => (
                <TenantCard
                  key={tenant.slug}
                  tenant={tenant}
                  locale={locale}
                  routePrefix={routePrefix}
                />
              ))
            ) : (
              <p className="empty-state">{dictionary.tower.emptyState}</p>
            )}
          </div>
        </aside>
      </div>

      {directoryOpen ? (
        <div className="directory-backdrop" role="presentation" onClick={() => setDirectoryOpen(false)}>
          <aside
            className="directory-sheet"
            aria-label="Tenant directory"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="directory-head">
              <div>
                <p className="eyebrow">{dictionary.tower.directoryEyebrow}</p>
                <h2>{dictionary.tower.directoryTitle}</h2>
              </div>
              <button type="button" onClick={() => setDirectoryOpen(false)}>
                {dictionary.tower.close}
              </button>
            </div>
            <div className="directory-list">
              {tenants.map((tenant) => (
                <TenantCard
                  key={tenant.slug}
                  tenant={tenant}
                  locale={locale}
                  routePrefix={routePrefix}
                  compact
                />
              ))}
            </div>
          </aside>
        </div>
      ) : null}
    </section>
  );
}

function TenantCard({
  tenant,
  locale,
  routePrefix = "",
  compact = false
}: {
  tenant: Tenant;
  locale: Locale;
  routePrefix?: "" | "/en" | "/ja";
  compact?: boolean;
}) {
  const dictionary = getDictionary(locale);
  const categoryLabel = dictionary.categoryLabels[tenant.category] ?? tenant.category;
  const profileHref = `${routePrefix}/profile/${tenant.slug}`;

  return (
    <Link className={compact ? "tenant-card compact-card" : "tenant-card"} href={profileHref}>
      <div>
        <strong>{tenant.name}</strong>
        <span>{tenant.ticker}</span>
      </div>
      <p>{tenant.description}</p>
      <footer>
        <span>{categoryLabel}</span>
        <span>
          {dictionary.tower.heatLabel} {tenant.heat}
        </span>
        <span>
          {dictionary.tower.floorAbbr} {tenant.floor}
        </span>
      </footer>
    </Link>
  );
}
