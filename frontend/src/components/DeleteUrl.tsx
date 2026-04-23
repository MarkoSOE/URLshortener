import { useState } from "react";

const DeleteUrl = () => {
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!adminKey.trim()) {
      setError("Please enter your admin key.");
      return;
    }
    setPhase("loading");

    const input = adminKey.trim();
    let secretKey = input;
    try {
      const parsed = new URL(input);
      const parts = parsed.pathname.split("/admin/");
      if (parts.length === 2 && parts[1]) {
        secretKey = parts[1];
      }
    } catch {
      // not a full URL, use input as-is
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/${secretKey}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      setPhase("success");
    } else {
      setPhase("error");
    }
  };

  const handleReset = () => {
    setAdminKey("");
    setError("");
    setPhase("idle");
  };

  return (
    <div className="page">
      <div className="card delete-card">
        <h2 className="card-title">Delete a link</h2>
        <p className="card-subtitle">
          Enter your admin key to permanently remove the corresponding short
          link.
        </p>

        <form onSubmit={handleDelete}>
          <div className="field">
            <label className="field-label">Admin Key</label>
            <div className="field-input-wrap">
              <input
                className={`field-input${error ? " error" : ""}`}
                type="text"
                placeholder="your-secret-admin-key"
                value={adminKey}
                onChange={(e) => {
                  setAdminKey(e.target.value);
                  if (error) setError("");
                }}
                disabled={phase === "loading" || phase === "success"}
                spellCheck={false}
              />
            </div>
            {error && <div className="field-error">! {error}</div>}
            <div className="field-hint">
              You received this key when the short link was created.
            </div>
          </div>

          {phase !== "success" && (
            <button
              type="submit"
              className="btn-danger"
              disabled={phase === "loading"}
              style={{ marginTop: 8 }}
            >
              {phase === "loading" ? (
                <span className="loading-dots">
                  Deleting<span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              ) : (
                "Delete link"
              )}
            </button>
          )}
        </form>

        {phase === "success" && (
          <>
            <div className="alert alert-success">
              <span>✓</span>
              <span>Short link deleted successfully.</span>
            </div>
            <div className="sep">done</div>
            <button
              className="btn-secondary"
              style={{ width: "100%" }}
              onClick={handleReset}
            >
              Delete another link
            </button>
          </>
        )}

        {phase === "error" && (
          <>
            <div className="alert alert-error">
              <span>✗</span>
              <span>
                No link found for that key. It may have already been deleted or
                the key is invalid.
              </span>
            </div>
            <button
              className="btn-secondary"
              style={{ width: "100%", marginTop: 16 }}
              onClick={handleReset}
            >
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DeleteUrl;
