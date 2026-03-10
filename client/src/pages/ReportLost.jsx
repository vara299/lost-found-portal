// ============================================================
// pages/ReportLost.jsx — Updated with image upload
// ============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLostItem } from "../services/api";

const CATEGORIES = [
  "Electronics", "Books", "Clothing", "Accessories",
  "ID/Cards", "Keys", "Bags", "Other",
];

const ReportLost = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    category: "Other",
    contactInfo: "",
  });

  // Separate state for the image file and preview
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // ============================================================
  // HANDLE IMAGE SELECTION
  // When user picks an image, show a preview before uploading
  // ============================================================
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Check file size on frontend too (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return setError("Image must be less than 5MB");
    }

    setImageFile(file);

    // Create a local URL to preview the image instantly
    // URL.createObjectURL creates a temporary browser URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // Remove selected image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.location || !formData.date) {
      return setError("Please fill in all required fields");
    }

    try {
      setLoading(true);
      setError("");

      // FormData is required for file uploads
      // It can hold both text fields AND files
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("location", formData.location);
      data.append("date", formData.date);
      data.append("category", formData.category);
      data.append("contactInfo", formData.contactInfo);

      // Only append image if user selected one
      if (imageFile) {
        data.append("image", imageFile); // "image" must match upload.single("image")
      }

      await createLostItem(data);

      setSuccess("✅ Lost item reported successfully!");
      setTimeout(() => navigate("/lost-items"), 2000);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to report item. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">🔍 Report a Lost Item</h1>
          <p className="text-gray-500 mt-2">
            The more specific you are, the better your chances of finding it!
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Blue Water Bottle, Black Laptop Bag"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-400"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the item — color, brand, size, any unique marks..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                💡 More detail = better AI matching
              </p>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location Lost <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Library 2nd Floor, Canteen, Block A"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-400"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Lost <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-400"
                required
              />
            </div>

            {/* Contact Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Info
                <span className="text-gray-400 text-xs ml-1">(optional)</span>
              </label>
              <input
                type="text"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                placeholder="Phone number or email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            {/* ============================================================
                IMAGE UPLOAD SECTION
                ============================================================ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Image
                <span className="text-gray-400 text-xs ml-1">(optional, max 5MB)</span>
              </label>

              {/* Show preview if image is selected */}
              {imagePreview ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  {/* Remove image button */}
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                /* Upload area — click to select image */
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-400 hover:bg-red-50 transition-colors">
                  <div className="text-center">
                    <div className="text-3xl mb-2">📸</div>
                    <p className="text-sm text-gray-500">Click to upload an image</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden" // hide default file input
                  />
                </label>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {loading ? "Submitting..." : "🔍 Report Lost Item"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/lost-items")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportLost;