const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  // ================= NAME =================
  name: {
    type: String,
    required: true,
    trim: true
  },

  // ================= EMAIL =================
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },

  // ================= PASSWORD =================
  password: {
    type: String,
    required: true
  },

  // ================= ROLE =================
  role: {
    type: String,

    enum: ["user", "admin"],

    default: "user"
  }

},
{
  timestamps: true
});


// ================= EXPORT =================
module.exports =
  mongoose.model("User", userSchema);