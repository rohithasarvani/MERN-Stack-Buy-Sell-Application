import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";
import MenuAppBar from "./components/navbar.jsx";

export default function Sell() {
  const [formData, setFormData] = useState({
    itemName: "",
    price: "",
    category: "",
    description: "",
  });

  const [userId, setUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1])); 
      setUserId(decodedToken.id);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("You must be logged in to sell an item.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/items/add",
        { ...formData, sellerId: userId },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );

      alert("Item listed successfully!");
      setFormData({ itemName: "", price: "", category: "", description: "" });
    } catch (error) {
      console.error("Error listing item:", error);
      alert("Failed to list item. Please try again.");
    }
  };

  return (
    <>
      <MenuAppBar />
      <Box sx={{ maxWidth: 500, mx: "auto", mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>Sell Your Item</Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Item Name" name="itemName" value={formData.itemName} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Price" name="price" type="number" value={formData.price} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Category" name="category" value={formData.category} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Description" name="description" multiline rows={4} value={formData.description} onChange={handleChange} margin="normal" required />
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth>Submit</Button>
          </Box>
        </form>
      </Box>
    </>
  );
}
