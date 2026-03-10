// ============================================================
// routes/lostRoutes.js — Updated with image upload
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
const upload = require("../middleware/uploadMiddleware");

// my-items must come before /:id
router.get("/my-items", protect, getMyLostItems);

router.route("/")
  .get(getAllLostItems)
  // upload.single("image") processes ONE file with field name "image"
  // It runs BEFORE createLostItem and adds file info to req.file
  .post(protect, upload.single("image"), createLostItem);

router.route("/:id")
  .get(getLostItemById)
  .delete(protect, deleteLostItem);

module.exports = router;