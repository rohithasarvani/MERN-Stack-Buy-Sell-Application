const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const Cart = require("../models/Cart");
const Item = require("../models/Item");

const router = express.Router();


router.post("/add", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { itemId } = req.body;

  try {
    console.log("Fetching item details for itemId:", itemId);
    const item = await Item.findById(itemId);

    if (!item) {
      console.log("Item not found");
      return res.status(404).json({ message: "Item not found" });
    }

    console.log("Checking if item is already in cart for user:", userId);
    const existingCartItem = await Cart.findOne({ user: userId, item: itemId });
    if (existingCartItem) {
      console.log("Item already in cart");
      return res.status(400).json({ message: "Item already in cart" });
    }

    console.log("Adding item to cart with details:", {
      userId,
      itemId,
      itemName: item.itemName,
      price: item.price,
      sellerId: item.sellerId,
      sellerFirstName: item.sellerFirstName,
      sellerLastName: item.sellerLastName,
    });

    const cartItem = new Cart({
      user: userId,
      item: itemId,
      itemName: item.itemName,
      price: item.price,
      sellerId: item.sellerId,
      sellerFirstName: item.sellerFirstName,
      sellerLastName: item.sellerLastName,
    });

    await cartItem.save();
    console.log("Item added to cart successfully");
    res.status(201).json({ message: "Item added to cart successfully!" });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ message: "Server error", error });
  }
});


router.get("/", authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    console.log("Fetching cart items for user:", userId);
    const cartItems = await Cart.find({ user: userId }).populate("item");
    console.log("Cart items retrieved:", cartItems);
    res.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Server error", error });
  }
});


router.delete("/remove/:id", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const cartItemId = req.params.id;

  try {
    console.log("Finding cart item to remove for user:", userId, "Cart Item ID:", cartItemId);
    const cartItem = await Cart.findOne({ _id: cartItemId, user: userId });
    if (!cartItem) {
      console.log("Item not found in cart");
      return res.status(404).json({ message: "Item not found in cart" });
    }

    await Cart.deleteOne({ _id: cartItemId });
    console.log("Item removed from cart successfully");
    res.json({ message: "Item removed from cart successfully" });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
