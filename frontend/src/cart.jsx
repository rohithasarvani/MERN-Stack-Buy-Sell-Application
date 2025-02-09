import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Grid, Card, CardContent, CircularProgress } from "@mui/material";
import axios from "axios";
import MenuAppBar from "./components/navbar.jsx";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [processingOrder, setProcessingOrder] = useState(false);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    setLoading(true);
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems(response.data);
      setTotalPrice(response.data.reduce((sum, item) => sum + item.price, 0));
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (cartItemId) => {
    const token = localStorage.getItem("authToken");

    try {
      await axios.delete(`http://localhost:5000/api/cart/remove/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update UI after removing item
      setCartItems((prevItems) => prevItems.filter((item) => item._id !== cartItemId));
      setTotalPrice((prevTotal) => prevTotal - (cartItems.find((item) => item._id === cartItemId)?.price || 0));
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item.");
    }
  };

  const handleBuy = async () => {
    if (processingOrder) return; 
    setProcessingOrder(true);

    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/orders/create",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message || "Order placed successfully!");
      setCartItems([]); 
      setTotalPrice(0);
    } catch (error) {
      console.error("Error placing order:", error);
      alert(error.response?.data?.message || "Failed to place order.");
    } finally {
      setProcessingOrder(false);
    }
  };

  return (
    <>
      <MenuAppBar />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4">My Cart</Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <CircularProgress />
          </Box>
        ) : cartItems.length > 0 ? (
          <>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {cartItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                  <Card sx={{ p: 2 }}>
                    <CardContent>
                      <Typography variant="h6">{item.itemName}</Typography>
                      <Typography variant="body1">Price: ₹{item.price}</Typography>
                      <Button
                        variant="contained"
                        color="secondary"
                        sx={{ mt: 1 }}
                        onClick={() => handleRemoveFromCart(item._id)}
                      >
                        Remove
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Typography variant="h6" sx={{ mt: 3 }}>Total Price: ₹{totalPrice}</Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleBuy}
              disabled={processingOrder}
            >
              {processingOrder ? "Processing..." : "BUY"}
            </Button>
          </>
        ) : (
          <Typography>No items in cart.</Typography>
        )}
      </Box>
    </>
  );
}
