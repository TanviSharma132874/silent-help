import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg px-3 px-md-4 navbar-modern">
      <span className="navbar-brand mb-0 d-flex align-items-center">
        <span className="brand-mark">SH</span>
        <span className="brand-title">Silent Help</span>
      </span>

      <div className="ms-auto">
        <button
          className={`nav-pill ${location.pathname === "/dashboard" ? "active" : ""}`}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>

        <button
          className={`nav-pill ${location.pathname === "/report" ? "active" : ""}`}
          onClick={() => navigate("/report")}
        >
          Report
        </button>

        <button className="nav-logout" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}