const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const Item = require("../models/Item");
const User = require("../models/User");
const router = express.Router();


router.post("/add", authenticateToken, async (req, res) => {
  try {
    const { itemName, price, category, description } = req.body;
    const { id } = req.user; 

   
    const seller = await User.findById(id).select("firstName lastName");
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    
    const newItem = new Item({
      itemName,
      price,
      category,
      description,
      sellerId: id,
      sellerFirstName: seller.firstName,
      sellerLastName: seller.lastName
    });

    await newItem.save();
    res.status(201).json({ message: "Item listed successfully", item: newItem });
  } catch (error) {
    console.error("Error saving new item:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

  

 


router.get("/", authenticateToken, async (req, res) => {
  try {
    const { search, categories } = req.query;
    const userId = req.user.id;

    let filter = { sellerId: { $ne: userId } }; 

    if (search) {
      filter.itemName = { $regex: search, $options: "i" };
    }

    if (categories) {
      const categoryArray = categories.split(",");
      filter.category = { $in: categoryArray };
    }

    const items = await Item.find(filter);
    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Server error.", error });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    const seller = await User.findById(item.sellerId).select("firstName lastName phone");
    res.json({ ...item.toObject(), seller });
  } catch (error) {
    console.error("Error fetching item details:", error);
    res.status(500).json({ error: "Failed to fetch item details" });
  }
});


router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("seller", "firstName lastName email");
    if (!item) return res.status(404).json({ message: "Item not found." });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
});


router.put("/:id", authenticateToken, async (req, res) => {
  const { itemName, price, description, category } = req.body;

  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found." });

    if (item.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this item." });
    }

    item.itemName = itemName || item.itemName;
    item.price = price || item.price;
    item.description = description || item.description;
    item.category = category || item.category;

    await item.save();
    res.status(200).json({ item, message: "Item updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
});



router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this item" });
    }

    await item.deleteOne();
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
