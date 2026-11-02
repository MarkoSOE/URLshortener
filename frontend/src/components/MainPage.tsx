import { Shortener } from "./Shortener";

const MainPage = () => {
  return (
    <div className="page page-center">
      <div className="card card-wide">
        <h1 className="card-title">Shorten a URL</h1>
        <p className="card-subtitle">Paste your long URL and get a clean short link instantly.</p>
        <Shortener showRecent />
      </div>
    </div>
  );
};

export default MainPage;
