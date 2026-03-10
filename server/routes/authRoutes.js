// ============================================================
// routes/authRoutes.js
// Defines the URL endpoints for authentication
// Routes = the "address" that maps a URL to a controller function
// ============================================================

const express = require("express");
const router = express.Router();

// Import controller functions
const { registerUser, loginUser, getUserProfile } = require("../controllers/authController");

// Import middleware for protected routes
const { protect } = require("../middleware/authMiddleware");

// ============================================================
// Route Definitions
//
// Full URL = base path + route path
// Base path is set in server.js as /api/auth
//
// POST /api/auth/register → registerUser controller
// POST /api/auth/login    → loginUser controller
// GET  /api/auth/profile  → getUserProfile controller (protected)
// ============================================================

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile); // protect = must be logged in

module.exports = router;