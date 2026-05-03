"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TenantSaveControl } from "@/components/tenant-save-control";
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
  const [favoriteCounts, setFavoriteCounts] = useState<Record<string, number>>({});
  const [savedSlugs, setSavedSlugs] = useState<Set<string>>(new Set());

  const activeFloor = floors.find((floor) => floor.floorNumber === selectedFloor) ?? floors[0];
  const tenantsOnFloor = useMemo(
    () => tenants.filter((tenant) => tenant.floor === selectedFloor),
    [selectedFloor, tenants]
  );

  useEffect(() => {
    let active = true;

    fetch("/api/favorites")
      .then((response) => response.json())
      .then((payload: { counts?: Record<string, number>; savedSlugs?: string[] }) => {
        if (!active) {
          return;
        }

        setFavoriteCounts(payload.counts ?? {});
        setSavedSlugs(new Set(payload.savedSlugs ?? []));
      })
      .catch(() => {
        if (active) {
          setFavoriteCounts({});
          setSavedSlugs(new Set());
        }
      });

    return () => {
      active = false;
    };
  }, []);

  function handleSaveChange(tenantSlug: string, saved: boolean, count: number) {
    setFavoriteCounts((current) => ({
      ...current,
      [tenantSlug]: count
    }));
    setSavedSlugs((current) => {
      const next = new Set(current);

      if (saved) {
        next.add(tenantSlug);
      } else {
        next.delete(tenantSlug);
      }

      return next;
    });
  }

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
                  saveCount={favoriteCounts[tenant.slug] ?? 0}
                  saved={savedSlugs.has(tenant.slug)}
                  onSaveChange={handleSaveChange}
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
                  saveCount={favoriteCounts[tenant.slug] ?? 0}
                  saved={savedSlugs.has(tenant.slug)}
                  onSaveChange={handleSaveChange}
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
  saveCount,
  saved,
  onSaveChange,
  compact = false
}: {
  tenant: Tenant;
  locale: Locale;
  routePrefix?: "" | "/en" | "/ja";
  saveCount: number;
  saved: boolean;
  onSaveChange: (tenantSlug: string, saved: boolean, count: number) => void;
  compact?: boolean;
}) {
  const dictionary = getDictionary(locale);
  const categoryLabel = dictionary.categoryLabels[tenant.category] ?? tenant.category;
  const profileHref = `${routePrefix}/profile/${tenant.slug}`;

  return (
    <article className="tenant-card-frame">
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
      <TenantSaveControl
        tenantSlug={tenant.slug}
        locale={locale}
        initialCount={saveCount}
        initialSaved={saved}
        compact={compact}
        onChange={onSaveChange}
      />
    </article>
  );
}
