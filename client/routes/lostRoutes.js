// ============================================================
// routes/lostRoutes.js
// URL endpoints for Lost Item operations
// ============================================================

const express = require("express");
const router = express.Router();

const {
  createLostItem,
  getAllLostItems,
  getLostItemById,
  deleteLostItem,
  getMyLostItems,
} = require("../controllers/lostController");

const { protect } = require("../middleware/authMiddleware");

// ============================================================
// Route Definitions
// Base path set in server.js as /api/lost
//
// GET    /api/lost           → get all lost items (public)
// POST   /api/lost           → create lost item (private)
// GET    /api/lost/my-items  → get my lost items (private)
// GET    /api/lost/:id       → get single item (public)
// DELETE /api/lost/:id       → delete item (private)
// ============================================================

// IMPORTANT: /my-items must come BEFORE /:id
// Otherwise Express will treat "my-items" as an ID
router.get("/my-items", protect, getMyLostItems);

router.route("/")
  .get(getAllLostItems)        // public
  .post(protect, createLostItem); // private

router.route("/:id")
  .get(getLostItemById)           // public
  .delete(protect, deleteLostItem); // private

module.exports = router;