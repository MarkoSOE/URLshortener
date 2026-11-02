import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Check, Copy, Plus } from "lucide-react";
import {
  copyText,
  displayUrl,
  fetchLinkInfo,
  formatDate,
  loadLinks,
  secretFromAdminUrl,
  type SavedLink,
} from "@/lib/links";

type Status = "loading" | "active" | "deleted" | "unknown";
type Row = SavedLink & { secret: string; clicks: number | null; status: Status };

const statusLabel: Record<Status, string> = {
  loading: "Checking…",
  active: "Active",
  deleted: "Deleted",
  unknown: "Unavailable",
};

export const LinksPage = () => {
  const [rows, setRows] = useState<Row[]>(() =>
    loadLinks().map((l) => ({ ...l, secret: secretFromAdminUrl(l.adminUrl), clicks: null, status: "loading" })),
  );
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadLinks().forEach((l) => {
      const secret = secretFromAdminUrl(l.adminUrl);
      fetchLinkInfo(secret)
        .then((info) => {
          if (cancelled) return;
          setRows((prev) =>
            prev.map((r) =>
              r.secret === secret
                ? { ...r, clicks: info ? info.clicks : r.clicks, status: info ? "active" : "deleted" }
                : r,
            ),
          );
        })
        .catch(() => {
          if (cancelled) return;
          setRows((prev) => prev.map((r) => (r.secret === secret ? { ...r, status: "unknown" } : r)));
        });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.shortUrl.toLowerCase().includes(q) || r.targetUrl.toLowerCase().includes(q));
  }, [rows, query]);

  const totalClicks = rows.reduce((sum, r) => sum + (r.clicks ?? 0), 0);
  const top = rows
    .filter((r) => r.clicks !== null)
    .sort((a, b) => (b.clicks ?? 0) - (a.clicks ?? 0))[0];

  const copy = (r: Row) => {
    copyText(r.shortUrl);
    setCopiedId(r.secret);
    setTimeout(() => setCopiedId((c) => (c === r.secret ? null : c)), 2000);
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">My links</h1>
          <p className="page-sub">Links you've shortened in this browser.</p>
        </div>
        <Link to="/" className="btn-primary">
          <Plus size={16} aria-hidden="true" />
          New link
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="empty">
          <h2 className="empty-title">No links yet</h2>
          <p className="muted">Links you shorten on this device will show up here with their click counts.</p>
          <Link to="/" className="btn-primary">
            Shorten your first link
          </Link>
        </div>
      ) : (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <span className="stat-label">Total links</span>
              <span className="stat-value">{rows.length.toLocaleString()}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total clicks</span>
              <span className="stat-value">{totalClicks.toLocaleString()}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Top link</span>
              <span className="stat-value-mono">{top ? displayUrl(top.shortUrl) : "—"}</span>
            </div>
          </div>

          <div className="table-card">
            <div className="table-toolbar">
              <label htmlFor="link-search" className="sr-only">
                Search links
              </label>
              <input
                id="link-search"
                type="search"
                className="field-input search-input"
                placeholder="Search by short link or destination"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <span className="muted small">
                {filtered.length} of {rows.length} links
              </span>
            </div>
            <div className="table-scroll">
              <table className="links-table">
                <thead>
                  <tr>
                    <th scope="col">Short link</th>
                    <th scope="col">Destination</th>
                    <th scope="col" className="num">
                      Clicks
                    </th>
                    <th scope="col">Created</th>
                    <th scope="col">Status</th>
                    <th scope="col">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.secret}>
                      <td>
                        <Link to={`/links/${r.secret}`} className="mono accent-text no-underline">
                          {displayUrl(r.shortUrl)}
                        </Link>
                      </td>
                      <td className="mono muted truncate dest-cell" title={r.targetUrl}>
                        {r.targetUrl}
                      </td>
                      <td className="num strong">{r.clicks === null ? "—" : r.clicks.toLocaleString()}</td>
                      <td className="muted">{formatDate(r.createdAt)}</td>
                      <td>
                        <span className={`badge badge-${r.status}`}>{statusLabel[r.status]}</span>
                      </td>
                      <td className="actions">
                        <button type="button" className="btn-small" onClick={() => copy(r)}>
                          {copiedId === r.secret ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                          {copiedId === r.secret ? "Copied" : "Copy"}
                        </button>
                        <Link to={`/links/${r.secret}`} className="btn-small">
                          Stats
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="muted empty-row">
                        No links match "{query}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
