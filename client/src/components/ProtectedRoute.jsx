// ============================================================
// components/ProtectedRoute.jsx
// Guards private pages — redirects to login if not authenticated
//
// HOW IT WORKS:
// Wrap any Route with <ProtectedRoute> in App.jsx
// If user is logged in  → show the page normally
// If user is NOT logged in → redirect to /login
// ============================================================

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // If not logged in, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the actual page
  return children;
};

export default ProtectedRoute;