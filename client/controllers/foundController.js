// ============================================================
// controllers/foundController.js
// Business logic for all Found Item operations
// ============================================================

const FoundItem = require("../models/FoundItem");

// ============================================================
// @route   POST /api/found
// @desc    Create a new found item report
// @access  Private
// ============================================================

const createFoundItem = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      date,
      category,
      contactInfo,
      currentLocation,
    } = req.body;

    // Validate required fields
    if (!title || !description || !location || !date) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const foundItem = await FoundItem.create({
      title,
      description,
      location,
      date,
      category,
      contactInfo,
      currentLocation,
      image: req.file ? `/uploads/${req.file.filename}` : "",
      postedBy: req.user.id,
    });

    res.status(201).json({
      message: "Found item reported successfully!",
      foundItem,
    });

  } catch (error) {
    console.error("Create Found Item Error:", error.message);
    res.status(500).json({ message: "Server error while creating found item" });
  }
};

// ============================================================
// @route   GET /api/found
// @desc    Get all found items (with optional search)
// @access  Public
// ============================================================

const getAllFoundItems = async (req, res) => {
  try {
    const { search } = req.query;

    let filter = {};

    if (search) {
      filter = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
        ],
      };
    }

    const foundItems = await FoundItem.find(filter)
      .populate("postedBy", "name email phone")
      .populate("claimedBy", "name email") // also populate who claimed it
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: foundItems.length,
      foundItems,
    });

  } catch (error) {
    console.error("Get Found Items Error:", error.message);
    res.status(500).json({ message: "Server error while fetching found items" });
  }
};

// ============================================================
// @route   GET /api/found/:id
// @desc    Get a single found item by ID
// @access  Public
// ============================================================

const getFoundItemById = async (req, res) => {
  try {
    const foundItem = await FoundItem.findById(req.params.id)
      .populate("postedBy", "name email phone")
      .populate("claimedBy", "name email");

    if (!foundItem) {
      return res.status(404).json({ message: "Found item not found" });
    }

    res.status(200).json({ foundItem });

  } catch (error) {
    console.error("Get Found Item Error:", error.message);
    res.status(500).json({ message: "Server error while fetching item" });
  }
};

// ============================================================
// @route   DELETE /api/found/:id
// @desc    Delete a found item (only by owner)
// @access  Private
// ============================================================

const deleteFoundItem = async (req, res) => {
  try {
    const foundItem = await FoundItem.findById(req.params.id);

    if (!foundItem) {
      return res.status(404).json({ message: "Found item not found" });
    }

    // Only the person who posted can delete
    if (foundItem.postedBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this item" });
    }

    await FoundItem.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Found item deleted successfully" });

  } catch (error) {
    console.error("Delete Found Item Error:", error.message);
    res.status(500).json({ message: "Server error while deleting item" });
  }
};

// ============================================================
// @route   PUT /api/found/:id/claim
// @desc    Claim a found item
// @access  Private
// ============================================================

const claimFoundItem = async (req, res) => {
  try {
    const foundItem = await FoundItem.findById(req.params.id);

    if (!foundItem) {
      return res.status(404).json({ message: "Found item not found" });
    }

    // Can't claim an already claimed item
    if (foundItem.status === "claimed") {
      return res.status(400).json({ message: "This item has already been claimed" });
    }

    // Can't claim your own post
    if (foundItem.postedBy.toString() === req.user.id.toString()) {
      return res.status(400).json({ message: "You cannot claim your own post" });
    }

    // Update the item as claimed
    foundItem.status = "claimed";
    foundItem.claimedBy = req.user.id;
    foundItem.claimedAt = new Date();

    await foundItem.save();

    res.status(200).json({
      message: "Item claimed successfully! Contact the finder to collect it.",
      foundItem,
    });

  } catch (error) {
    console.error("Claim Item Error:", error.message);
    res.status(500).json({ message: "Server error while claiming item" });
  }
};

// ============================================================
// @route   GET /api/found/my-items
// @desc    Get all found items posted by logged in user
// @access  Private
// ============================================================

const getMyFoundItems = async (req, res) => {
  try {
    const foundItems = await FoundItem.find({ postedBy: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({ count: foundItems.length, foundItems });

  } catch (error) {
    console.error("Get My Found Items Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createFoundItem,
  getAllFoundItems,
  getFoundItemById,
  deleteFoundItem,
  claimFoundItem,
  getMyFoundItems,
};