import { useNavigate } from "react-router";

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="home-container">
        <div className="home-eyebrow">URLsnip</div>
        <h1 className="home-title">
          Long links,
          <br />
          <span>snipped.</span>
        </h1>
        <p className="home-desc">
          Transform long-form URLs into clean, shareable short links in seconds.
          Fast, minimal, no friction.
        </p>
        <div className="home-actions">
          <button className="btn-primary" onClick={() => navigate("/create")}>
            Shorten a URL
          </button>
          <button className="btn-secondary" onClick={() => navigate("/delete")}>
            Delete a link
          </button>
        </div>
        <div className="home-stats">
          <div className="stat-item">
            <div className="stat-value">~2s</div>
            <div className="stat-label">to shorten</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">∞</div>
            <div className="stat-label">links</div>
          </div>
        </div>
      </div>
    </div>
  );
};
