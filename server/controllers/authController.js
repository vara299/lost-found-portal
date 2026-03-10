// ============================================================
// controllers/authController.js
// Contains the logic for Register and Login
// Controllers = the "brain" that handles what happens
//               when a route is called
// ============================================================

const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ============================================================
// HELPER FUNCTION — Generate JWT Token
// A token is like a digital ID card for the logged-in user
// It contains the user's ID and expires in 7 days
// ============================================================

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },              // payload — what we store in the token
    process.env.JWT_SECRET,      // secret key to sign the token
    { expiresIn: "7d" }          // token expires in 7 days
  );
};

// ============================================================
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public (anyone can register)
// ============================================================

const registerUser = async (req, res) => {
  try {
    // Step 1: Extract data from request body
    const { name, email, password, phone } = req.body;

    // Step 2: Validate — check all required fields are present
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Step 3: Check if user already exists with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Step 4: Create new user
    // Note: password hashing happens automatically via pre-save hook in User.js
    const user = await User.create({
      name,
      email,
      password,
      phone,
    });

    // Step 5: Generate a token for the new user
    const token = generateToken(user._id);

    // Step 6: Send back response (never send password back!)
    res.status(201).json({
      message: "Registration successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ============================================================
// @route   POST /api/auth/login
// @desc    Login user and return JWT token
// @access  Public
// ============================================================

const loginUser = async (req, res) => {
  try {
    // Step 1: Extract email and password from request body
    const { email, password } = req.body;

    // Step 2: Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Step 3: Find the user by email in the database
    const user = await User.findOne({ email });

    // Step 4: If user not found, send error
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Step 5: Compare entered password with hashed password
    // matchPassword() is our custom method defined in User.js
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Step 6: Generate token
    const token = generateToken(user._id);

    // Step 7: Send success response
    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
};

// ============================================================
// @route   GET /api/auth/profile
// @desc    Get logged-in user's profile
// @access  Private (requires token)
// ============================================================

const getUserProfile = async (req, res) => {
  try {
    // req.user is set by the authMiddleware (Step 3D)
    const user = await User.findById(req.user.id).select("-password");
    // .select("-password") means return everything EXCEPT password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });

  } catch (error) {
    console.error("Profile Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };