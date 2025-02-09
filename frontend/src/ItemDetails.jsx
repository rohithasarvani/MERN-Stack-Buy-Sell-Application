import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import axios from "axios";
import MenuAppBar from "./components/navbar.jsx";

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/items/${id}`);
        setItem(response.data);
      } catch (error) {
        console.error("Error fetching item details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please log in to add items to the cart.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/cart/add",
        { itemId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Item added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart.");
    }
  };

  if (loading) return <CircularProgress />;
  if (!item) return <Typography>Error loading item</Typography>;

  return (<> <MenuAppBar/>
  <Box sx={{ maxWidth: 600, mx: "auto", mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
  <Typography variant="h4">{item.itemName}</Typography>
  <Typography variant="h6">Category: {item.category}</Typography>
  <Typography variant="h6">Price: ₹{item.price}</Typography>
  <Typography variant="h6">Description: {item.description}</Typography>

  {item.seller ? (
    <Typography variant="h6">
      Seller Name: {item.seller.firstName} {item.seller.lastName}
    </Typography>
  ) : (
    <Typography>Loading seller details...</Typography>
  )}

  
  <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }} onClick={handleAddToCart}>
    Add to Cart
  </Button>

  <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={() => navigate("/cart")}>
    Go to Cart
  </Button>
</Box></>
   
  );
}
