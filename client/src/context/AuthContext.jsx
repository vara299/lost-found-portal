// ============================================================
// context/AuthContext.jsx
// Global state management for authentication
//
// WHY CONTEXT?
// Without context, we'd have to pass user data as props
// through every component. Context makes user data available
// ANYWHERE in the app without prop drilling.
// ============================================================

import { createContext, useContext, useState, useEffect } from "react";

// Step 1: Create the context object
const AuthContext = createContext();

// Step 2: Create the Provider component
// Wrap our entire app with this so all components can access auth state
export const AuthProvider = ({ children }) => {

  // Initialize state from localStorage so user stays logged in
  // even after page refresh
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  // ============================================================
  // LOGIN — saves user and token to state and localStorage
  // ============================================================
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
  };

  // ============================================================
  // LOGOUT — clears everything
  // ============================================================
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // ============================================================
  // isAuthenticated — simple boolean check
  // ============================================================
  const isAuthenticated = !!token; // converts token to true/false

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Step 3: Custom hook — makes using context cleaner
// Instead of: const { user } = useContext(AuthContext)
// We can write: const { user } = useAuth()
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;