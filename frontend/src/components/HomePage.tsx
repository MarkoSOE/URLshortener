import { useNavigate } from "react-router";

const specs: [string, string][] = [
  ["Key length", "5 characters"],
  ["Encoding", "base64url"],
  ["Admin key", "Issued per link"],
  ["Account", "None required"],
  ["Origin", "urlsnip.ca"],
];

const principles: [string, string][] = [
  ["Short", "Five characters, nothing more than needed"],
  ["Fast", "Hot links are served straight from cache"],
  ["Honest", "No tracking pixels, no interstitial ads"],
  ["Unobtrusive", "No sign-up — paste, shorten, share"],
];

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="page">
      <section className="home-hero">
        <div>
          <div className="eyebrow">US-01 / Shortener</div>
          <h1 className="home-title">
            Long links,
            <br />
            snipped.
          </h1>
          <p className="home-desc">
            Transform long-form URLs into clean, shareable short links in
            seconds.
          </p>
          <div className="home-actions">
            <button className="btn-primary" onClick={() => navigate("/create")}>
              Shorten a URL
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/delete")}
            >
              Delete a link
            </button>
          </div>
          <dl className="spec-table">
            {specs.map(([label, value]) => (
              <div className="spec-row" key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="grid-panel" aria-hidden="true">
          <div className="device">
            <div className="device-lcd">
              <span className="device-lcd-bar" />
              <span>/xY3k_</span>
            </div>
            <div className="device-keys">
              {Array.from({ length: 24 }, (_, i) => (
                <span
                  key={i}
                  className={`device-key${i === 19 ? " on" : ""}`}
                />
              ))}
            </div>
            <div className="device-foot">
              <span className="dot" />
              SNIP
            </div>
          </div>
          <span className="callout callout-a">A — Short key · 5 chars</span>
          <span className="callout callout-b left">
            B — Quick and easy to use
          </span>
        </div>
      </section>

      <section className="principles">
        <div className="eyebrow">Principles · applied to URL/SNIP</div>
        <ol className="principles-list">
          {principles.map(([title, desc], i) => (
            <li className="principle" key={title}>
              <span className="principle-num">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <div className="principle-title">{title}</div>
                <div className="principle-desc">{desc}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};
