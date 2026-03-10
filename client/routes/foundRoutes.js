// ============================================================
// routes/foundRoutes.js
// URL endpoints for Found Item operations
// ============================================================

const express = require("express");
const router = express.Router();

const {
  createFoundItem,
  getAllFoundItems,
  getFoundItemById,
  deleteFoundItem,
  claimFoundItem,
  getMyFoundItems,
} = require("../controllers/foundController");

const { protect } = require("../middleware/authMiddleware");

// ============================================================
// Route Definitions
// Base path: /api/found
//
// GET    /api/found              → get all found items (public)
// POST   /api/found              → create found item (private)
// GET    /api/found/my-items     → get my found items (private)
// GET    /api/found/:id          → get single item (public)
// DELETE /api/found/:id          → delete item (private)
// PUT    /api/found/:id/claim    → claim item (private)
// ============================================================

// IMPORTANT: /my-items must come BEFORE /:id
router.get("/my-items", protect, getMyFoundItems);

router.route("/")
  .get(getAllFoundItems)
  .post(protect, createFoundItem);

router.route("/:id")
  .get(getFoundItemById)
  .delete(protect, deleteFoundItem);

// Claim route
router.put("/:id/claim", protect, claimFoundItem);

module.exports = router;