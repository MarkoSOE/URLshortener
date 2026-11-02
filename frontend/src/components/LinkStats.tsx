import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, Check, Copy, ExternalLink, Trash2 } from "lucide-react";
import {
  copyText,
  displayUrl,
  fetchLinkInfo,
  formatDate,
  loadLinks,
  secretFromAdminUrl,
  type LinkInfo,
} from "@/lib/links";

type Result =
  | { kind: "ok"; info: LinkInfo }
  | { kind: "deleted" }
  | { kind: "error" };
type State = Result | { kind: "loading" };

export const LinkStats = () => {
  const { secret = "" } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState<(Result & { secret: string }) | null>(null);
  const state: State = result && result.secret === secret ? result : { kind: "loading" };
  const [copied, setCopied] = useState(false);
  const saved = loadLinks().find((l) => secretFromAdminUrl(l.adminUrl) === secret);

  useEffect(() => {
    let cancelled = false;
    fetchLinkInfo(secret)
      .then((info) => {
        if (!cancelled) setResult(info ? { kind: "ok", info, secret } : { kind: "deleted", secret });
      })
      .catch(() => {
        if (!cancelled) setResult({ kind: "error", secret });
      });
    return () => {
      cancelled = true;
    };
  }, [secret]);

  const shortUrl = state.kind === "ok" ? state.info.url : saved?.shortUrl;
  const targetUrl = state.kind === "ok" ? state.info.target_url : saved?.targetUrl;

  const copy = () => {
    if (!shortUrl) return;
    copyText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="page">
      <Link to="/links" className="back-link">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to my links
      </Link>

      <div className="page-head">
        <div className="stats-heading">
          <h1 className="stats-short">{shortUrl ? displayUrl(shortUrl) : "Link stats"}</h1>
          {targetUrl && <span className="mono muted truncate">→ {targetUrl}</span>}
        </div>
        {state.kind === "ok" && (
          <div className="button-row">
            <button type="button" className="btn-secondary" onClick={copy}>
              {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
              {copied ? "Copied" : "Copy link"}
            </button>
            <a className="btn-secondary" href={state.info.url} target="_blank" rel="noreferrer">
              <ExternalLink size={16} aria-hidden="true" />
              Visit
            </a>
            <button
              type="button"
              className="btn-danger-outline"
              onClick={() => navigate("/delete", { state: { adminKey: secret } })}
            >
              <Trash2 size={16} aria-hidden="true" />
              Delete
            </button>
          </div>
        )}
      </div>

      {state.kind === "loading" && <p className="muted">Loading stats…</p>}

      {state.kind === "deleted" && (
        <div className="alert alert-error">
          <span>This link has been deleted or the admin key is invalid.</span>
        </div>
      )}

      {state.kind === "error" && (
        <div className="alert alert-error">
          <span>Couldn't reach the server. Please try again in a moment.</span>
        </div>
      )}

      {state.kind === "ok" && (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <span className="stat-label">Total clicks</span>
              <span className="stat-value">{state.info.clicks.toLocaleString()}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Status</span>
              <span className="stat-value">{state.info.is_active ? "Active" : "Inactive"}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Created</span>
              <span className="stat-value">{formatDate(saved?.createdAt)}</span>
            </div>
          </div>
          <p className="muted small">
            Clicks over time, referrers, locations and devices aren't tracked yet. Only the total click count is
            recorded.
          </p>
        </>
      )}
    </div>
  );
};
