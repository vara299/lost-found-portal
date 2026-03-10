// ============================================================
// middleware/uploadMiddleware.js
// Configures Multer for handling image uploads
//
// HOW MULTER WORKS:
// 1. Request comes in with an image file attached
// 2. Multer intercepts it before the controller
// 3. Saves the file to /uploads folder with a unique name
// 4. Adds file info to req.file so controller can use it
// ============================================================

const multer = require("multer");
const path = require("path");

// ============================================================
// STORAGE CONFIGURATION
// Tells Multer WHERE and HOW to save files
// ============================================================

const storage = multer.diskStorage({

  // destination = which folder to save the file in
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // save to server/uploads/
  },

  // filename = what to name the saved file
  // We use Date.now() to make every filename unique
  // This prevents files from overwriting each other
  filename: (req, file, cb) => {
    // Example output: "1709123456789-photo.jpg"
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    cb(null, uniqueName);
  },
});

// ============================================================
// FILE FILTER
// Only allow image files — reject PDFs, videos, etc.
// ============================================================

const fileFilter = (req, file, cb) => {
  // Check the file extension
  const allowedTypes = /jpeg|jpg|png|gif|webp/;

  // extname checks extension: ".jpg" → true
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  // mimetype checks file type: "image/jpeg" → true
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // accept the file
  } else {
    cb(new Error("Only image files are allowed! (jpeg, jpg, png, gif, webp)"));
  }
};

// ============================================================
// MULTER INSTANCE
// Combines storage + fileFilter + size limit
// ============================================================

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

module.exports = upload;