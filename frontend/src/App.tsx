import MainPage from "@/components/MainPage";
import { BrowserRouter, Routes, Route, NavLink } from "react-router";
import NewUrl from "@/components/NewUrl";
import Page404 from "./components/Page404";
import DeleteUrl from "./components/DeleteUrl";
import { HomePage } from "./components/HomePage";
import { ContactPage } from "./components/ContactPage";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <NavLink to="/" className="nav-logo">
          <span className="nav-logo-bracket">[</span>
          URLsnip
          <span className="nav-logo-bracket">]</span>
        </NavLink>
        <div className="nav-links">
          {(
            [
              ["/", "Home"],
              ["/create", "Create"],
              ["/delete", "Delete"],
            ] as [string, string][]
          ).map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<MainPage />} />
        <Route path="/created" element={<NewUrl />} />
        <Route path="/delete" element={<DeleteUrl />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
      <footer>URLsnip — fast url shortener &nbsp;·&nbsp; urlsnip.ca</footer>
    </BrowserRouter>
  );
}

export default App;
