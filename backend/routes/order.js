const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

router.post("/", async (req, res) => {
  const order = new Order(req.body);
  await order.save();
  res.json({ message: "Order placed" });
});

router.get("/", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

module.exports = router;