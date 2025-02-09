const express = require("express");
const bcrypt = require("bcryptjs");
const { authenticateToken } = require("../middleware/authMiddleware");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");
const mongoose = require("mongoose");

const router = express.Router();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();


router.post("/create", authenticateToken, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const buyerId = new mongoose.Types.ObjectId(req.user.id);
    
    
    const cartItems = await Cart.find({ user: buyerId })
      .populate({
        path: 'item',
        populate: { path: 'sellerId' }
      });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orders = [];
    const otpMessages = [];

    
    for (const cartItem of cartItems) {
      const otp = generateOTP();
      const hashedOtp = await bcrypt.hash(otp, 10);

      const newOrder = new Order({
        itemId: cartItem.item._id,
        buyerId: buyerId,
        sellerId: cartItem.item.sellerId,
        amount: cartItem.item.price,
        otp: hashedOtp,
        originalOtp: otp, 
        status: "pending"
      });

      await newOrder.save({ session });
      orders.push(newOrder);
      otpMessages.push(`${cartItem.item.name}: ${otp}`);
    }

   
    await Cart.deleteMany({ user: buyerId }, { session });

    await session.commitTransaction();

    res.status(201).json({
      message: "Orders created successfully",
      orders: orders,
      otpMessages: otpMessages
    });

  } catch (error) {
    await session.abortTransaction();
    console.error("Error creating orders:", error);
    res.status(500).json({ message: "Server error" });
  } finally {
    session.endSession();
  }
});

router.get("/pending", authenticateToken, async (req, res) => {
  try {
      const sellerId = new mongoose.Types.ObjectId(req.user.id);
      console.log("Seller ID from Token:", sellerId);  

      const pendingOrders = await Order.find({
          sellerId: sellerId,
          status: "pending"
      })
      .populate('itemId')
      .populate('buyerId', 'email firstName lastName')
      .lean();

      console.log("Pending Orders for Seller:", pendingOrders);  

      res.json(pendingOrders);
  } catch (error) {
      console.error("Error fetching pending orders:", error);
      res.status(500).json({ message: "Error fetching pending orders" });
  }
});



router.get("/history", authenticateToken, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

  
    const boughtOrders = await Order.find({ buyerId: userId })
      .populate('itemId')
      .populate('sellerId', 'email firstName lastName')
      .lean();

 
    const soldOrders = await Order.find({ sellerId: userId })
      .populate('itemId')
      .populate('buyerId', 'email firstName lastName')
      .lean();

    res.json({
      bought: boughtOrders,
      sold: soldOrders
    });
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).json({ message: "Error fetching order history" });
  }
});


router.post("/verify-otp", authenticateToken, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId, enteredOtp } = req.body;
    if (!orderId || !enteredOtp) {
      return res.status(400).json({ message: "Order ID and OTP are required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "completed") {
      return res.status(400).json({ message: "Order is already completed" });
    }

    const isOtpValid = await bcrypt.compare(enteredOtp, order.otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Incorrect OTP" });
    }

   
    order.status = "completed";
    await order.save({ session });

    await session.commitTransaction();
    res.json({ message: "Order completed successfully" });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Error verifying OTP" });
  } finally {
    session.endSession();
  }
});


router.post("/regenerate-otp", authenticateToken, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ message: "Cannot regenerate OTP for completed orders" });
    }

    
    if (order.buyerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to regenerate OTP for this order" });
    }

    const newOtp = generateOTP();
    const hashedOtp = await bcrypt.hash(newOtp, 10);

    order.otp = hashedOtp;
    order.originalOtp = newOtp;
    await order.save({ session });

    await session.commitTransaction();

    res.json({
      message: "OTP regenerated successfully",
      otp: newOtp
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error regenerating OTP:", error);
    res.status(500).json({ message: "Error regenerating OTP" });
  } finally {
    session.endSession();
  }
});

module.exports = router;