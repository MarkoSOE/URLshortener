import { useState } from "react";

type UrlResult = {
  shortUrl: string;
  adminUrl: string;
};

const MainPage = () => {
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const [result, setResult] = useState<UrlResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedAdmin, setCopiedAdmin] = useState(false);

  const validate = () => {
    if (!url.trim()) {
      setUrlError("Please enter a URL.");
      return false;
    }
    try {
      new URL(url.trim());
    } catch {
      setUrlError("Enter a valid URL including https://");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError("");
    if (!validate()) return;
    setPhase("loading");
    setResult(null);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target_url: url.trim() }),
    });
    const data = await response.json();
    setResult({ shortUrl: data.url, adminUrl: data.admin_url });
    setPhase("done");
  };

  const copyToClipboard = (text: string, which: "short" | "admin") => {
    navigator.clipboard.writeText(text).catch(() => {});
    if (which === "short") {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setCopiedAdmin(true);
      setTimeout(() => setCopiedAdmin(false), 2000);
    }
  };

  const handleReset = () => {
    setUrl("");
    setResult(null);
    setPhase("idle");
    setUrlError("");
    setCopied(false);
    setCopiedAdmin(false);
  };

  return (
    <div className="page">
      <div className="card">
        <h2 className="card-title">Shorten a URL</h2>
        <p className="card-subtitle">
          Paste your long URL and get a clean short link instantly.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="field-label">Destination URL</label>
            <div className="field-input-wrap">
              <input
                className={`field-input${urlError ? " error" : ""}`}
                type="text"
                placeholder="https://example.com/very/long/url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (urlError) setUrlError("");
                }}
                disabled={phase === "loading"}
                spellCheck={false}
              />
            </div>
            {urlError && <div className="field-error">! {urlError}</div>}
          </div>

          {phase === "loading" && (
            <div className="compress-anim">
              <div className="compress-bar" />
            </div>
          )}

          {phase !== "done" && (
            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%", marginTop: 8 }}
              disabled={phase === "loading"}
            >
              {phase === "loading" ? (
                <span className="loading-dots">
                  Shortening<span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              ) : (
                "Shorten →"
              )}
            </button>
          )}
        </form>

        {result && phase === "done" && (
          <>
            <div className="result-box">
              <div className="result-label">Short link ready</div>
              <div className="result-url-row">
                <a
                  href={result.shortUrl}
                  className="result-url"
                  target="_blank"
                  rel="noreferrer"
                >
                  {result.shortUrl}
                </a>
                <button
                  className={`copy-btn${copied ? " copied" : ""}`}
                  onClick={() => copyToClipboard(result.shortUrl, "short")}
                >
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <div className="result-admin">
                <div className="result-admin-label">Admin / Delete URL</div>
                <div className="result-url-row">
                  <span className="result-admin-url">{result.adminUrl}</span>
                  <button
                    className={`copy-btn${copiedAdmin ? " copied" : ""}`}
                    onClick={() => copyToClipboard(result.adminUrl, "admin")}
                  >
                    {copiedAdmin ? "✓ Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </div>

            <div className="sep">or</div>
            <button
              className="btn-secondary"
              style={{ width: "100%" }}
              onClick={handleReset}
            >
              Shorten another URL
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MainPage;
