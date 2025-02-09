const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sellerFirstName: { type: String, required: true },
  sellerLastName: { type: String, required: true },
});

module.exports = mongoose.model("Item", itemSchema);
