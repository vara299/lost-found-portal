const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

// ✅ All 3 routes active
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/lost", require("./routes/lostRoutes"));
app.use("/api/found", require("./routes/foundRoutes"));

app.get("/", (req, res) => {
  res.json({
    message: "🎓 Lost & Found Portal API is running!",
    status: "Server OK",
    database: mongoose.connection.readyState === 1 ? "Connected ✅" : "Disconnected ❌",
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("🔴 Error:", err.message);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});