const mongoose = require("mongoose");

const foundItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    category: {
      type: String,
      enum: ["Electronics","Books","Clothing","Accessories","ID/Cards","Keys","Bags","Other"],
      default: "Other",
    },
    image: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["available", "claimed"],
      default: "available",
    },
    currentLocation: {
      type: String,
      default: "With finder",
    },
    contactInfo: {
      type: String,
      default: "",
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    claimedAt: {
      type: Date,
      default: null,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const FoundItem = mongoose.model("FoundItem", foundItemSchema);
module.exports = FoundItem;