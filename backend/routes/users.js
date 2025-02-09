const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();


const JWT_SECRET = process.env.JWT_SECRET;


router.put("/profile", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { firstName, lastName, email, age, contactNumber, password } = req.body;

  try {
   
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

   
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.age = age || user.age;
    user.contactNumber = contactNumber || user.contactNumber;

  
    if (password) {
      
      user.password = password;
    }

    
    await user.save();

    res.status(200).json({ user, message: "Profile updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
});


router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, age, contactNumber } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered." });

  
    

    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      age,
      contactNumber,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const isPasswordValid = await bcrypt.compare(password, user.password);
 
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials." });




const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
console.log("JWT token created:", token);



res.status(200).json({ token, message: "Login successful." });
} catch (error) {
console.error("Login Error:", error); 
res.status(500).json({ message: "Server error.", error });
}
});

router.get("/profile", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  console.log("Authenticated request for user ID:", userId);
  try {
    const user = await User.findById(userId).select("-password"); 
    if (!user) return res.status(404).json({ message: "User not found." });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
});


router.post("/logout", (req, res) => {
  console.log("Logout initiated.");
  res.json({ message: "Logged out successfully." });
  console.log("Logout response sent.");
});





module.exports = router;
