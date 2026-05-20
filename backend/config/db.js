const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("MONGO URI =", process.env.MONGO_URI); // DEBUG LINE

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is undefined in .env file");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.log("MongoDB Connection Failed ❌");
    console.log(error.message);
  }
};

module.exports = connectDB;