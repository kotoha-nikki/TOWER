"use client";

import { useEffect, useState } from "react";
import { getDictionary, type Locale } from "@/lib/i18n";

type TenantSaveControlProps = {
  tenantSlug: string;
  locale: Locale;
  initialCount?: number;
  initialSaved?: boolean;
  compact?: boolean;
  onChange?: (tenantSlug: string, saved: boolean, count: number) => void;
};

export function TenantSaveControl({
  tenantSlug,
  locale,
  initialCount,
  initialSaved,
  compact = false,
  onChange
}: TenantSaveControlProps) {
  const dictionary = getDictionary(locale);
  const [count, setCount] = useState(initialCount ?? 0);
  const [saved, setSaved] = useState(initialSaved ?? false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof initialCount === "number" && typeof initialSaved === "boolean") {
      setCount(initialCount);
      setSaved(initialSaved);
      return;
    }

    let active = true;

    fetch(`/api/favorites?tenantSlug=${encodeURIComponent(tenantSlug)}`)
      .then((response) => response.json())
      .then((payload: { count?: number; saved?: boolean }) => {
        if (!active) {
          return;
        }

        setCount(payload.count ?? 0);
        setSaved(Boolean(payload.saved));
      })
      .catch(() => {
        if (active) {
          setError(dictionary.saves.unavailable);
        }
      });

    return () => {
      active = false;
    };
  }, [dictionary.saves.unavailable, initialCount, initialSaved, tenantSlug]);

  useEffect(() => {
    if (typeof initialCount === "number") {
      setCount(initialCount);
    }
  }, [initialCount]);

  useEffect(() => {
    if (typeof initialSaved === "boolean") {
      setSaved(initialSaved);
    }
  }, [initialSaved]);

  async function toggleSave() {
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantSlug,
          saved: !saved
        })
      });
      const payload = await response.json();

      if (response.status === 401) {
        setError(dictionary.saves.connectToSave);
        return;
      }

      if (!response.ok) {
        throw new Error(payload.error ?? dictionary.saves.unavailable);
      }

      setSaved(Boolean(payload.saved));
      setCount(payload.count ?? 0);
      onChange?.(tenantSlug, Boolean(payload.saved), payload.count ?? 0);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : dictionary.saves.unavailable);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={compact ? "tenant-save compact-save" : "tenant-save"}>
      <button type="button" onClick={toggleSave} disabled={busy}>
        {busy ? dictionary.saves.saving : saved ? dictionary.saves.saved : dictionary.saves.save}
      </button>
      <span>
        {count} {dictionary.saves.countLabel}
      </span>
      {error ? <small>{error}</small> : null}
    </div>
  );
}
