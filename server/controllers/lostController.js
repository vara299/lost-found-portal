const LostItem = require("../models/LostItem");

const createLostItem = async (req, res) => {
  try {
    const { title, description, location, date, category, contactInfo } = req.body;
    if (!title || !description || !location || !date) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }
    const lostItem = await LostItem.create({
      title, description, location, date, category, contactInfo,
      image: req.file ? `/uploads/${req.file.filename}` : "",
      postedBy: req.user.id,
    });
    res.status(201).json({ message: "Lost item reported successfully!", lostItem });
  } catch (error) {
    console.error("Create Lost Item Error:", error.message);
    res.status(500).json({ message: "Server error while creating lost item" });
  }
};

const getAllLostItems = async (req, res) => {
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
    const lostItems = await LostItem.find(filter)
      .populate("postedBy", "name email phone")
      .sort({ createdAt: -1 });
    res.status(200).json({ count: lostItems.length, lostItems });
  } catch (error) {
    console.error("Get Lost Items Error:", error.message);
    res.status(500).json({ message: "Server error while fetching lost items" });
  }
};

const getLostItemById = async (req, res) => {
  try {
    const lostItem = await LostItem.findById(req.params.id)
      .populate("postedBy", "name email phone");
    if (!lostItem) return res.status(404).json({ message: "Lost item not found" });
    res.status(200).json({ lostItem });
  } catch (error) {
    console.error("Get Lost Item Error:", error.message);
    res.status(500).json({ message: "Server error while fetching item" });
  }
};

const deleteLostItem = async (req, res) => {
  try {
    const lostItem = await LostItem.findById(req.params.id);
    if (!lostItem) return res.status(404).json({ message: "Lost item not found" });
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

const getMyLostItems = async (req, res) => {
  try {
    const lostItems = await LostItem.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ count: lostItems.length, lostItems });
  } catch (error) {
    console.error("Get My Lost Items Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createLostItem, getAllLostItems, getLostItemById, deleteLostItem, getMyLostItems };
