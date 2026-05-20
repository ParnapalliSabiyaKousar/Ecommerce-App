require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const app = express();


// ======================
// DEBUG ENV (optional)
// ======================
console.log("MONGO URI =", process.env.MONGO_URI);


// ======================
// MIDDLEWARE
// ======================
app.use(cors());
app.use(express.json());


// ======================
// SERVE UPLOADED IMAGES
// ======================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ======================
// CONNECT DATABASE
// ======================
connectDB();


// ======================
// ROUTES
// ======================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/product"));
app.use("/api/orders", require("./routes/order"));


// ======================
// DEFAULT ROUTE
// ======================
app.get("/", (req, res) => {
  res.send("🚀 E-Commerce API is running...");
});


// ======================
// START SERVER
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});