const mongoose = require("mongoose");

// ======================
// PRODUCT SCHEMA
// ======================
const productSchema = new mongoose.Schema(
  {
    // PRODUCT NAME
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // PRICE
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // DESCRIPTION
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // IMAGE
    image: {
      type: String,
      default: "https://via.placeholder.com/300",
    },

    // CATEGORY (STEP 2 FIX)
    category: {
      type: String,
      required: true,
      enum: ["men", "women", "kids", "jewellery"],
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

// ======================
// EXPORT MODEL
// ======================
module.exports = mongoose.model("Product", productSchema);