const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  otp: { type: String, required: true },  
  status: { type: String, enum: ["pending", "completed"], default: "pending" }
});

module.exports = mongoose.model("Order", OrderSchema);
