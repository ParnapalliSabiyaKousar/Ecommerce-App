const express = require("express");
const router = express.Router();

const Product = require("../models/Product");

const {
  verifyToken,
  isAdmin
} = require("../middleware/auth");


// ==========================
// GET ALL PRODUCTS
// PUBLIC
// ==========================
router.get("/", async (req, res) => {

  try {

    const products =
      await Product.find()
      .sort({ createdAt: -1 });

    res.json(products);

  }

  catch (err) {

    console.log("GET PRODUCTS ERROR:", err);

    res.status(500).json({
      error: "Failed to fetch products"
    });
  }
});


// ==========================
// GET SINGLE PRODUCT
// PUBLIC
// ==========================
router.get("/:id", async (req, res) => {

  try {

    const product =
      await Product.findById(req.params.id);

    if (!product) {

      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(product);

  }

  catch (err) {

    console.log("GET SINGLE PRODUCT ERROR:", err);

    res.status(500).json({
      error: "Invalid product ID"
    });
  }
});


// ==========================
// ADD PRODUCT
// ADMIN ONLY
// ==========================
router.post(
  "/",
  verifyToken,
  isAdmin,

  async (req, res) => {

    try {

      let {
        name,
        price,
        description,
        image,
        category
      } = req.body;


      // ==========================
      // CLEAN CATEGORY
      // ==========================
      category = (category || "")
        .toString()
        .toLowerCase()
        .trim();


      // ==========================
      // VALIDATION
      // ==========================
      if (
        !name ||
        !price ||
        !description ||
        !category
      ) {

        return res.status(400).json({
          error: "All fields are required"
        });
      }


      // ==========================
      // CONVERT PRICE
      // ==========================
      price = Number(price);

      if (
        isNaN(price) ||
        price <= 0
      ) {

        return res.status(400).json({
          error: "Invalid price"
        });
      }


      // ==========================
      // CREATE PRODUCT
      // ==========================
      const product =
        await Product.create({

          name: name.trim(),

          price,

          description:
            description.trim(),

          image:
            image ||
            "https://via.placeholder.com/300",

          category
        });


      // ==========================
      // SUCCESS
      // ==========================
      res.status(201).json({

        message:
          "Product added successfully",

        product
      });

    }

    catch (err) {

      console.log("ADD PRODUCT ERROR:", err);

      res.status(500).json({
        error: "Failed to add product"
      });
    }
  }
);



// ==========================
// UPDATE PRODUCT
// ADMIN ONLY
// ==========================
router.put(
  "/:id",
  verifyToken,
  isAdmin,

  async (req, res) => {

    try {

      // CLEAN CATEGORY
      if (req.body.category) {

        req.body.category =
          req.body.category
          .toString()
          .toLowerCase()
          .trim();
      }


      // FIX PRICE
      if (req.body.price) {

        req.body.price =
          Number(req.body.price);
      }


      const product =
        await Product.findByIdAndUpdate(

          req.params.id,

          req.body,

          {
            new: true,
            runValidators: true
          }
        );


      if (!product) {

        return res.status(404).json({
          message: "Product not found"
        });
      }


      res.json({

        message:
          "Product updated successfully",

        product
      });

    }

    catch (err) {

      console.log("UPDATE PRODUCT ERROR:", err);

      res.status(500).json({
        error: "Failed to update product"
      });
    }
  }
);



// ==========================
// DELETE PRODUCT
// ADMIN ONLY
// ==========================
router.delete(
  "/:id",
  verifyToken,
  isAdmin,

  async (req, res) => {

    try {

      const product =
        await Product.findByIdAndDelete(
          req.params.id
        );


      if (!product) {

        return res.status(404).json({
          message: "Product not found"
        });
      }


      res.json({

        message:
          "Product deleted successfully"
      });

    }

    catch (err) {

      console.log("DELETE PRODUCT ERROR:", err);

      res.status(500).json({
        error: "Failed to delete product"
      });
    }
  }
);


// ==========================
// EXPORT
// ==========================
module.exports = router;