// ============================================================
// middleware/authMiddleware.js
// Protects private routes — checks if user has a valid token
//
// How it works:
// 1. User logs in → gets a JWT token
// 2. User sends token in every request header
// 3. This middleware checks if token is valid
// 4. If valid → allows the request to continue
// 5. If invalid → blocks the request with 401 Unauthorized
// ============================================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Step 1: Check if token exists in request headers
  // Token is sent as: Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Step 2: Extract token (remove "Bearer " prefix)
      token = req.headers.authorization.split(" ")[1];

      // Step 3: Verify the token using our secret key
      // If token is tampered or expired, this throws an error
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Step 4: Find the user and attach to request object
      // Now any route using this middleware can access req.user
      req.user = await User.findById(decoded.id).select("-password");

      // Step 5: Continue to the actual route handler
      next();

    } catch (error) {
      console.error("Token verification failed:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // If no token was found in headers
  if (!token) {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

module.exports = { protect };