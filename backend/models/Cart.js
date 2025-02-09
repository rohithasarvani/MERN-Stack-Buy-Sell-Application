const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  itemName: { type: String, required: true },
  price: { type: Number, required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sellerFirstName: { type: String, required: true },
  sellerLastName: { type: String, required: true },
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
