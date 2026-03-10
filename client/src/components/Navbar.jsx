// ============================================================
// components/Navbar.jsx
// Top navigation bar shown on all pages
// ============================================================

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-wide hover:text-indigo-200">
          🎓 Lost & Found Portal
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-indigo-200 font-medium">
            Home
          </Link>
          <Link to="/lost-items" className="hover:text-indigo-200 font-medium">
            Lost Items
          </Link>
          <Link to="/found-items" className="hover:text-indigo-200 font-medium">
            Found Items
          </Link>

          {/* Show these links only if user is logged in */}
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to="/report-lost"
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm font-medium"
              >
                + Report Lost
              </Link>
              <Link
                to="/report-found"
                className="bg-emerald-500 hover:bg-emerald-600 px-3 py-1 rounded-md text-sm font-medium"
              >
                + Report Found
              </Link>
              <span className="text-indigo-200 text-sm">
                👤 {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-white text-indigo-600 hover:bg-indigo-100 px-3 py-1 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="hover:text-indigo-200 font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-indigo-600 hover:bg-indigo-100 px-3 py-1 rounded-md text-sm font-medium"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;