import { useNavigate } from "react-router";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="eyebrow">Error / 404</div>
      <h1 className="plain-title">You seem lost.</h1>
      <p className="plain-desc">
        This URL is not correct, please make a U-turn.
      </p>
      <button className="btn-primary" onClick={() => navigate("/")}>
        Back to home
      </button>
    </div>
  );
};

export default PageNotFound;
