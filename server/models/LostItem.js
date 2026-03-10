const mongoose = require("mongoose");

const lostItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    description: { type: String, required: [true, "Description is required"], trim: true },
    location: { type: String, required: [true, "Location is required"], trim: true },
    date: { type: Date, required: [true, "Date is required"] },
    category: {
      type: String,
      enum: ["Electronics","Books","Clothing","Accessories","ID/Cards","Keys","Bags","Other"],
      default: "Other",
    },
    image: { type: String, default: "" },
    status: { type: String, enum: ["lost","found","claimed"], default: "lost" },
    contactInfo: { type: String, default: "" },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const LostItem = mongoose.model("LostItem", lostItemSchema);
module.exports = LostItem;
