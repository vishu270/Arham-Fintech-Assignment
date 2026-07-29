const express = require("express");
const cors = require("cors");

const clientRoutes = require("./routes/clientRoutes");
const tradeRoutes = require("./routes/tradeRoutes");
const internalRoutes = require("./routes/internalRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Arham Fintech Backend Running 🚀",
  });
});

// API Routes
app.use("/clients", clientRoutes);
app.use("/trades", tradeRoutes);
app.use("/internal", internalRoutes);

module.exports = app;