const express = require("express");

const router = express.Router();

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/User");


// ==========================
// REGISTER
// ==========================
router.post("/register", async (req, res) => {

  try {

    const {
      name,
      email,
      password
    } = req.body;


    console.log("REGISTER BODY:", req.body);


    // ==========================
    // VALIDATION
    // ==========================

    if (
      !name ||
      !email ||
      !password
    ) {

      return res.status(400).json({
        error: "All fields are required"
      });
    }


    // ==========================
    // CHECK USER EXISTS
    // ==========================

    const exist =
      await User.findOne({
        email: email.trim()
      });

    if (exist) {

      return res.status(400).json({
        error: "User already exists"
      });
    }


    // ==========================
    // HASH PASSWORD
    // ==========================

    const hashed =
      await bcrypt.hash(password, 10);


    // ==========================
    // CREATE USER
    // ==========================

    const user =
      new User({

        name: name.trim(),

        email: email.trim(),

        password: hashed,

        role: "user"
      });


    // ==========================
    // SAVE USER
    // ==========================

    await user.save();

    console.log("USER SAVED SUCCESSFULLY");


    // ==========================
    // SUCCESS
    // ==========================

    res.status(201).json({
      message: "Registered successfully"
    });

  }

  catch (err) {

    console.log("REGISTER ERROR:");
    console.log(err);

    res.status(500).json({
      error: "Registration failed"
    });
  }
});


// ==========================
// LOGIN
// ==========================
router.post("/login", async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;


    console.log("LOGIN BODY:", req.body);


    // ==========================
    // VALIDATION
    // ==========================

    if (
      !email ||
      !password
    ) {

      return res.status(400).json({
        error: "Email and password required"
      });
    }


    // ==========================
    // FIND USER
    // ==========================

    const user =
      await User.findOne({
        email: email.trim()
      });


    console.log("FOUND USER:", user);


    if (!user) {

      return res.status(400).json({
        error: "User not found"
      });
    }


    // ==========================
    // CHECK PASSWORD
    // ==========================

    const ok =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!ok) {

      return res.status(400).json({
        error: "Wrong password"
      });
    }


    // ==========================
    // CREATE TOKEN
    // ==========================

    const token =
      jwt.sign(

        {
          id: user._id,
          role: user.role
        },

        "SECRET",

        {
          expiresIn: "7d"
        }
      );


    // ==========================
    // SUCCESS RESPONSE
    // ==========================

    res.json({

      message:
        "Login successful",

      token,

      user: {

        id: user._id,

        name: user.name,

        email: user.email,

        role: user.role
      }
    });

  }

  catch (err) {

    console.log("LOGIN ERROR:");
    console.log(err);

    res.status(500).json({
      error: "Login failed"
    });
  }
});


// ==========================
// EXPORT
// ==========================
module.exports = router;