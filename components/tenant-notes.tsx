"use client";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";

type TenantNote = {
  id: string;
  tenantSlug: string;
  walletAddress: string;
  walletLabel: string;
  body: string;
  createdAt: string;
};

type TenantNotesProps = {
  tenantSlug: string;
  locale: Locale;
};

const labels = {
  en: {
    eyebrow: "Tenant notes",
    title: "Public notes from residents",
    body:
      "Wallet-signed visitors can leave short notes. Public reading is open; writing is wallet-gated.",
    placeholder: "Leave a short note for this tenant...",
    post: "Post note",
    posting: "Posting...",
    connect: "Connect wallet to write a note.",
    empty: "No notes yet. Be the first resident to leave a signal.",
    unavailable: "Tenant notes are unavailable.",
    delete: "Delete",
    deleting: "Deleting..."
  },
  ja: {
    eyebrow: "Tenant notes",
    title: "住民からの公開メモ",
    body:
      "ウォレットでサインした来訪者だけが短いメモを残せます。読むことは誰でもできます。",
    placeholder: "このテナントに短いメモを書く...",
    post: "メモを投稿",
    posting: "投稿中...",
    connect: "メモを書くにはウォレット接続が必要です。",
    empty: "まだメモはありません。最初の住民メモを残してみてください。",
    unavailable: "Tenant notes を読み込めません。",
    delete: "削除",
    deleting: "削除中..."
  }
};

export function TenantNotes({ tenantSlug, locale }: TenantNotesProps) {
  const copy = labels[locale] ?? labels.en;
  const [notes, setNotes] = useState<TenantNote[]>([]);
  const [walletAddress, setWalletAddress] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  const canPost = body.trim().length > 0 && body.trim().length <= 480 && !busy;

  const orderedNotes = useMemo(
    () =>
      [...notes].sort(
        (first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt)
      ),
    [notes]
  );

  useEffect(() => {
    let active = true;

    Promise.all([
      fetch(`/api/notes?tenantSlug=${encodeURIComponent(tenantSlug)}`).then((response) =>
        response.json()
      ),
      fetch("/api/auth/session").then((response) => response.json())
    ])
      .then(([notesPayload, sessionPayload]) => {
        if (!active) {
          return;
        }

        setNotes(notesPayload.notes ?? []);
        setWalletAddress(sessionPayload.user?.walletAddress ?? "");
      })
      .catch(() => {
        if (active) {
          setError(copy.unavailable);
        }
      });

    return () => {
      active = false;
    };
  }, [copy.unavailable, tenantSlug]);

  async function postNote() {
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantSlug,
          body
        })
      });
      const payload = await response.json();

      if (response.status === 401) {
        setError(copy.connect);
        return;
      }

      if (!response.ok) {
        throw new Error(payload.error ?? copy.unavailable);
      }

      setNotes((current) => [payload.note, ...current]);
      setBody("");
    } catch (noteError) {
      setError(noteError instanceof Error ? noteError.message : copy.unavailable);
    } finally {
      setBusy(false);
    }
  }

  async function deleteNote(noteId: string) {
    setDeletingId(noteId);
    setError("");

    try {
      const response = await fetch("/api/notes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? copy.unavailable);
      }

      setNotes((current) => current.filter((note) => note.id !== noteId));
    } catch (noteError) {
      setError(noteError instanceof Error ? noteError.message : copy.unavailable);
    } finally {
      setDeletingId("");
    }
  }

  return (
    <section className="tenant-notes-panel">
      <div className="tenant-notes-head">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2>{copy.title}</h2>
          <p>{copy.body}</p>
        </div>
        <span>{orderedNotes.length}</span>
      </div>

      <div className="tenant-note-composer">
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          maxLength={480}
          placeholder={copy.placeholder}
        />
        <div>
          <small>{body.trim().length}/480</small>
          <button type="button" onClick={postNote} disabled={!canPost}>
            {busy ? copy.posting : copy.post}
          </button>
        </div>
      </div>

      {error ? <p className="tenant-note-error">{error}</p> : null}

      <div className="tenant-notes-list">
        {orderedNotes.length ? (
          orderedNotes.map((note) => (
            <article key={note.id} className="tenant-note-card">
              <header>
                <strong>{note.walletLabel}</strong>
                <time dateTime={note.createdAt}>{formatDate(note.createdAt)}</time>
              </header>
              <p>{note.body}</p>
              {walletAddress && walletAddress === note.walletAddress ? (
                <button
                  type="button"
                  onClick={() => deleteNote(note.id)}
                  disabled={deletingId === note.id}
                >
                  {deletingId === note.id ? copy.deleting : copy.delete}
                </button>
              ) : null}
            </article>
          ))
        ) : (
          <p className="empty-state">{copy.empty}</p>
        )}
      </div>
    </section>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}
