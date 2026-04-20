import MainPage from "@/components/MainPage";
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router";
import NewUrl from "@/components/NewUrl";
import Page404 from "./components/Page404";
import DeleteUrl from "./components/DeleteUrl";
import { HomePage } from "./components/HomePage";
import { ContactPage } from "./components/ContactPage";

function App() {
  const navLinkStyles = ({ isActive }) => ({
    color: isActive ? "#007bff" : "#333",
    textDecoration: isActive ? "none" : "underline",
    fontWeight: isActive ? "bold" : "normal",
    padding: "5px 10px",
  });
  return (
    <BrowserRouter>
      <nav style={{ marginBottom: "20px" }}>
        <NavLink to="/" style={navLinkStyles}>
          Home
        </NavLink>{" "}
        <NavLink to="/create" style={navLinkStyles}>
          Create
        </NavLink>{" "}
        <NavLink to="/delete" style={navLinkStyles}>
          Delete
        </NavLink>{" "}
        <NavLink to="/contact" style={navLinkStyles}>
          Contact
        </NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<MainPage />} />
        <Route path="/created" element={<NewUrl />} />
        <Route path="/delete" element={<DeleteUrl />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Page404 />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
