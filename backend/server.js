
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "AGRI-CONNECT API is working",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// Add a product
app.post("/api/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
});

// Get one product
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "Invalid product ID" });
  }
});

// Delete a product
app.delete("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid product ID" });
  }
});

// Start the server
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
    autoSelectFamily: false,
    });
    console.log("MongoDB Atlas connected successfully!");

    app.listen(PORT, () => {
      console.log(`AGRI-CONNECT backend running on port ${PORT}`);
    });
  } catch (error) {
  console.error("MongoDB connection failed:", error.message);
  console.error("Error name:", error.name);
  console.error("Error code:", error.code || "Not provided");
  console.error(
    "Error causes:",
    error.cause?.message || "No additional cause provided"
  );
  process.exit(1);
}
}

startServer();
