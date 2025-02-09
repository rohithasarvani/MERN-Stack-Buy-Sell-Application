import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, TextField, Button, Alert, Snackbar } from "@mui/material";
import axios from "axios";
import MenuAppBar from "./components/navbar.jsx";

const DeliveryItems = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [enteredOtps, setEnteredOtps] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info"
  });

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      console.log("pending");
      const token = localStorage.getItem("authToken");
      const response = await axios.get("http://localhost:5000/api/orders/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      setPendingOrders(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error fetching pending orders",
        severity: "error"
      });
    }
  };

  const handleOtpSubmit = async (orderId) => {
    if (!enteredOtps[orderId]) {
      setSnackbar({
        open: true,
        message: "Please enter OTP",
        severity: "warning"
      });
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        "http://localhost:5000/api/orders/verify-otp",
        { 
          orderId, 
          enteredOtp: enteredOtps[orderId] 
        },
        { 
          headers: { Authorization: `Bearer ${token}` } 
        }
      );

      // Remove the verified order from the list
      setPendingOrders(prev => prev.filter(order => order._id !== orderId));
      
      // Clear the entered OTP
      setEnteredOtps(prev => {
        const newOtps = { ...prev };
        delete newOtps[orderId];
        return newOtps;
      });

      setSnackbar({
        open: true,
        message: "Order completed successfully",
        severity: "success"
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Incorrect OTP",
        severity: "error"
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <MenuAppBar />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Pending Deliveries</Typography>
        
        {pendingOrders.length === 0 ? (
          <Typography>No pending orders to deliver.</Typography>
        ) : (
          pendingOrders.map((order) => (
            <Card key={order._id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">Item: {order.itemId?.name}</Typography>
                <Typography>Price: ₹{order.itemId?.price}</Typography>
                <Typography>Buyer Email: {order.buyerId?.email}</Typography>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField
                    label="Enter OTP"
                    variant="outlined"
                    size="small"
                    value={enteredOtps[order._id] || ""}
                    onChange={(e) => setEnteredOtps({
                      ...enteredOtps,
                      [order._id]: e.target.value
                    })}
                  />
                  <Button 
                    variant="contained" 
                    onClick={() => handleOtpSubmit(order._id)}
                  >
                    Verify & Complete Delivery
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default DeliveryItems;
