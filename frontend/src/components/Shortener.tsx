import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { Check, Copy, KeyRound, Link2 } from "lucide-react";
import {
  copyText,
  createLink,
  displayUrl,
  loadLinks,
  saveLink,
  secretFromAdminUrl,
  type SavedLink,
} from "@/lib/links";

type Props = { showRecent?: boolean };

export const Shortener = ({ showRecent = false }: Props) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SavedLink | null>(null);
  const [copied, setCopied] = useState<"short" | "admin" | null>(null);
  const [recent, setRecent] = useState<SavedLink[]>(() => loadLinks());

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const value = url.trim();
    if (!value) {
      setError("Please enter a URL.");
      return;
    }
    try {
      const parsed = new URL(value);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error();
    } catch {
      setError("Enter a full URL starting with http:// or https://");
      return;
    }

    setLoading(true);
    try {
      const data = await createLink(value);
      const saved: SavedLink = {
        shortUrl: data.url,
        adminUrl: data.admin_url,
        targetUrl: data.target_url,
        createdAt: new Date().toISOString(),
      };
      saveLink(saved);
      setResult(saved);
      setRecent(loadLinks());
      setUrl("");
      setCopied(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copy = (text: string, which: "short" | "admin") => {
    copyText(text);
    setCopied(which);
    setTimeout(() => setCopied((c) => (c === which ? null : c)), 2000);
  };

  return (
    <div className="shortener">
      <form className="shorten-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="long-url" className="sr-only">
          Long URL
        </label>
        <div className="shorten-input">
          <Link2 size={18} aria-hidden="true" />
          <input
            id="long-url"
            type="url"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            placeholder="https://example.com/a/very/long/link"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError("");
            }}
            disabled={loading}
            aria-invalid={!!error}
            aria-describedby={error ? "url-error" : undefined}
          />
        </div>
        <button type="submit" className="btn-primary shorten-btn" disabled={loading}>
          {loading ? (
            <span className="loading-dots">
              Shortening<span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          ) : (
            "Shorten"
          )}
        </button>
      </form>

      {error && (
        <p id="url-error" role="alert" className="shorten-error">
          {error}
        </p>
      )}

      {result && (
        <div className="result-card" aria-live="polite">
          <div className="result-row">
            <div className="result-text">
              <span className="result-kicker">Your short link</span>
              <a className="result-short" href={result.shortUrl} target="_blank" rel="noreferrer">
                {displayUrl(result.shortUrl)}
              </a>
              <span className="result-long">{result.targetUrl}</span>
            </div>
            <button type="button" className="btn-light" onClick={() => copy(result.shortUrl, "short")}>
              {copied === "short" ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
              {copied === "short" ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="result-admin">
            <KeyRound size={18} aria-hidden="true" className="result-admin-icon" />
            <div className="result-text">
              <span className="result-kicker">Admin URL — keep it to view stats or delete this link</span>
              <span className="result-admin-url">{result.adminUrl}</span>
            </div>
            <button type="button" className="btn-outline-dark" onClick={() => copy(result.adminUrl, "admin")}>
              {copied === "admin" ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      )}

      {showRecent && recent.length > 0 && (
        <div className="recent">
          <div className="recent-head">
            <span className="kicker">Your recent links</span>
            <Link to="/links" className="text-link">
              View all
            </Link>
          </div>
          {recent.slice(0, 3).map((l) => (
            <Link key={l.adminUrl} to={`/links/${secretFromAdminUrl(l.adminUrl)}`} className="recent-row">
              <span className="mono accent-text">{displayUrl(l.shortUrl)}</span>
              <span className="mono muted truncate">{l.targetUrl}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
