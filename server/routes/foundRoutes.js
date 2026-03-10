// ============================================================
// routes/foundRoutes.js — Updated with image upload
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
const upload = require("../middleware/uploadMiddleware");

// my-items must come before /:id
router.get("/my-items", protect, getMyFoundItems);

router.route("/")
  .get(getAllFoundItems)
  .post(protect, upload.single("image"), createFoundItem);

router.route("/:id")
  .get(getFoundItemById)
  .delete(protect, deleteFoundItem);

router.put("/:id/claim", protect, claimFoundItem);

module.exports = router;