// ============================================================
// controllers/lostController.js
// Business logic for all Lost Item operations
// ============================================================

const LostItem = require("../models/LostItem");

// ============================================================
// @route   POST /api/lost
// @desc    Create a new lost item report
// @access  Private (must be logged in)
// ============================================================

const createLostItem = async (req, res) => {
  try {
    const { title, description, location, date, category, contactInfo } = req.body;

    // Validate required fields
    if (!title || !description || !location || !date) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Create the lost item
    // req.user.id comes from our authMiddleware (the logged in user)
    const lostItem = await LostItem.create({
      title,
      description,
      location,
      date,
      category,
      contactInfo,
      image: req.file ? `/uploads/${req.file.filename}` : "", // image upload (Step 8)
      postedBy: req.user.id,
    });

    res.status(201).json({
      message: "Lost item reported successfully!",
      lostItem,
    });

  } catch (error) {
    console.error("Create Lost Item Error:", error.message);
    res.status(500).json({ message: "Server error while creating lost item" });
  }
};

// ============================================================
// @route   GET /api/lost
// @desc    Get all lost items (with optional search)
// @access  Public
// ============================================================

const getAllLostItems = async (req, res) => {
  try {
    // Get search query from URL: /api/lost?search=bottle
    const { search } = req.query;

    // Build filter object
    let filter = {};

    // If search query exists, search in title and description
    // $regex = pattern matching (like SQL LIKE)
    // $options: "i" = case insensitive
    if (search) {
      filter = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Fetch items from database
    // .populate() replaces postedBy ID with actual user data
    // .sort() shows newest items first
    const lostItems = await LostItem.find(filter)
      .populate("postedBy", "name email phone") // get user details
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({
      count: lostItems.length,
      lostItems,
    });

  } catch (error) {
    console.error("Get Lost Items Error:", error.message);
    res.status(500).json({ message: "Server error while fetching lost items" });
  }
};

// ============================================================
// @route   GET /api/lost/:id
// @desc    Get a single lost item by ID
// @access  Public
// ============================================================

const getLostItemById = async (req, res) => {
  try {
    const lostItem = await LostItem.findById(req.params.id)
      .populate("postedBy", "name email phone");

    // If item doesn't exist
    if (!lostItem) {
      return res.status(404).json({ message: "Lost item not found" });
    }

    res.status(200).json({ lostItem });

  } catch (error) {
    console.error("Get Lost Item Error:", error.message);
    res.status(500).json({ message: "Server error while fetching item" });
  }
};

// ============================================================
// @route   DELETE /api/lost/:id
// @desc    Delete a lost item (only by owner or admin)
// @access  Private
// ============================================================

const deleteLostItem = async (req, res) => {
  try {
    const lostItem = await LostItem.findById(req.params.id);

    if (!lostItem) {
      return res.status(404).json({ message: "Lost item not found" });
    }

    // Check if the logged in user is the owner of this post
    // .toString() converts MongoDB ObjectId to string for comparison
    if (lostItem.postedBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this item" });
    }

    await LostItem.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Lost item deleted successfully" });

  } catch (error) {
    console.error("Delete Lost Item Error:", error.message);
    res.status(500).json({ message: "Server error while deleting item" });
  }
};

// ============================================================
// @route   GET /api/lost/my-items
// @desc    Get all lost items posted by logged in user
// @access  Private
// ============================================================

const getMyLostItems = async (req, res) => {
  try {
    const lostItems = await LostItem.find({ postedBy: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({ count: lostItems.length, lostItems });

  } catch (error) {
    console.error("Get My Lost Items Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createLostItem,
  getAllLostItems,
  getLostItemById,
  deleteLostItem,
  getMyLostItems,
};