import { BrowserRouter, Routes, Route, NavLink } from "react-router";
import MainPage from "@/components/MainPage";
import NewUrl from "@/components/NewUrl";
import Page404 from "./components/Page404";
import DeleteUrl from "./components/DeleteUrl";
import { HomePage } from "./components/HomePage";
import { ContactPage } from "./components/ContactPage";
import { LinksPage } from "./components/LinksPage";
import { LinkStats } from "./components/LinkStats";
import { BrandMark } from "./components/BrandMark";

const navItems: [string, string][] = [
  ["/", "Home"],
  ["/links", "My links"],
  ["/delete", "Delete a link"],
];

function App() {
  return (
    <BrowserRouter>
      <header className="site-header">
        <div className="container header-inner">
          <NavLink to="/" className="brand" aria-label="urlsnip home">
            <BrandMark />
            <span className="brand-name">urlsnip</span>
          </NavLink>
          <nav aria-label="Main" className="nav-links">
            {navItems.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              >
                {label}
              </NavLink>
            ))}
            <a
              href="https://github.com/MarkoSOE/URLshortener"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-github"
              aria-label="View source on GitHub"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-1.97c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
              </svg>
            </a>
          </nav>
        </div>
      </header>
      <main className="site-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<MainPage />} />
          <Route path="/created" element={<NewUrl />} />
          <Route path="/links" element={<LinksPage />} />
          <Route path="/links/:secret" element={<LinkStats />} />
          <Route path="/delete" element={<DeleteUrl />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <span>© {new Date().getFullYear()} urlsnip</span>
          <span>urlsnip.ca</span>
        </div>
      </footer>
    </BrowserRouter>
  );
}

export default App;
