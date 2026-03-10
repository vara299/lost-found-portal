// ============================================================
// models/User.js
// Defines the structure of a User document in MongoDB
// ============================================================

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Schema = blueprint of how a User looks in the database
const userSchema = new mongoose.Schema(
  {
    // Full name of the user
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,                // removes extra spaces
    },

    // Email must be unique — no two users with same email
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,           // always store as lowercase
      trim: true,
    },

    // Password will be hashed before saving
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },

    // Role: regular student or admin
    role: {
      type: String,
      enum: ["user", "admin"],   // only these two values allowed
      default: "user",
    },

    // Phone number (optional)
    phone: {
      type: String,
      default: "",
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// ============================================================
// MIDDLEWARE (pre-save hook)
// This runs AUTOMATICALLY before every .save() call
// It hashes the password if it was changed
// ============================================================

// In Mongoose 7+, async middleware handles completion automatically
// No need to call next() when using async/await
userSchema.pre("save", async function () {
  // Only hash if password was modified (or is new)
  if (!this.isModified("password")) return;

  // bcrypt.genSalt(10) creates a random "salt" value
  // Higher number = more secure but slower (10 is standard)
  const salt = await bcrypt.genSalt(10);

  // Replace plain text password with hashed version
  this.password = await bcrypt.hash(this.password, salt);
});

// ============================================================
// INSTANCE METHOD
// We can call this on any user object to check password
// Example: const isMatch = await user.matchPassword("mypassword")
// ============================================================

userSchema.methods.matchPassword = async function (enteredPassword) {
  // bcrypt.compare() compares plain text with hashed password
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export the model
const User = mongoose.model("User", userSchema);
module.exports = User;