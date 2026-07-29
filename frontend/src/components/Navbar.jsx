import { Link, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">

        {/* Logo */}
        <Link className="navbar-brand fw-bold" to="/clients">
          💰 Arham Fintech
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">

            <li className="nav-item">
              <NavLink
                to="/clients"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active fw-bold text-warning" : ""}`
                }
              >
                👥 Clients
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/trades"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active fw-bold text-warning" : ""}`
                }
              >
                📊 Trades
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/my-clients"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active fw-bold text-warning" : ""}`
                }
              >
                💼 My Clients
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/employees"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active fw-bold text-warning" : ""}`
                }
              >
                👔 Employees
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/incentives"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active fw-bold text-warning" : ""}`
                }
              >
                🎯 Incentives
              </NavLink>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;