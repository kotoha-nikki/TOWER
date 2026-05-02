"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Floor, Tenant } from "@/lib/tower-data";

type TowerExperienceProps = {
  floors: Floor[];
  tenants: Tenant[];
};

export function TowerExperience({ floors, tenants }: TowerExperienceProps) {
  const [selectedFloor, setSelectedFloor] = useState(23);
  const [directoryOpen, setDirectoryOpen] = useState(false);

  const activeFloor = floors.find((floor) => floor.floorNumber === selectedFloor) ?? floors[0];
  const tenantsOnFloor = useMemo(
    () => tenants.filter((tenant) => tenant.floor === selectedFloor),
    [selectedFloor, tenants]
  );

  return (
    <section className="tower-shell" aria-label="Tower map experience">
      <div className="tower-toolbar">
        <div>
          <p className="eyebrow">Interactive map</p>
          <h2>Click a floor to inspect its tenants.</h2>
        </div>
        <button type="button" onClick={() => setDirectoryOpen(true)}>
          Open directory
        </button>
      </div>

      <div className="tower-grid">
        <div className="tower-visual">
          <img src="/banner.png" alt="Draft drawing of the Tower Map building" />
          <div className="floor-rail" aria-label="Floor selector">
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
          <p className="eyebrow">Floor {activeFloor.floorNumber}</p>
          <h2>{activeFloor.label}</h2>
          <p>{activeFloor.narrative}</p>

          <div className="signal-row">
            {activeFloor.signalBands.map((signal) => (
              <span key={signal}>{signal}</span>
            ))}
          </div>

          <div className="tenant-list">
            <div className="tenant-list-heading">
              <span>Tenants</span>
              <strong>{tenantsOnFloor.length}</strong>
            </div>
            {tenantsOnFloor.length > 0 ? (
              tenantsOnFloor.map((tenant) => <TenantCard key={tenant.slug} tenant={tenant} />)
            ) : (
              <p className="empty-state">
                No public sample tenants on this floor yet. The full registry arrives in a later
                construction layer.
              </p>
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
                <p className="eyebrow">Directory</p>
                <h2>Sample tenant registry</h2>
              </div>
              <button type="button" onClick={() => setDirectoryOpen(false)}>
                Close
              </button>
            </div>
            <div className="directory-list">
              {tenants.map((tenant) => (
                <TenantCard key={tenant.slug} tenant={tenant} compact />
              ))}
            </div>
          </aside>
        </div>
      ) : null}
    </section>
  );
}

function TenantCard({ tenant, compact = false }: { tenant: Tenant; compact?: boolean }) {
  return (
    <Link className={compact ? "tenant-card compact-card" : "tenant-card"} href={`/profile/${tenant.slug}`}>
      <div>
        <strong>{tenant.name}</strong>
        <span>{tenant.ticker}</span>
      </div>
      <p>{tenant.description}</p>
      <footer>
        <span>{tenant.category}</span>
        <span>Heat {tenant.heat}</span>
        <span>FL {tenant.floor}</span>
      </footer>
    </Link>
  );
}
