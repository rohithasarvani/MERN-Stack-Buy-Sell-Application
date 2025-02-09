import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Tabs, 
  Tab, 
  Alert,
  Snackbar
} from "@mui/material";
import axios from "axios";
import MenuAppBar from "./components/navbar.jsx";

export default function OrderHistory() {
  const [tabValue, setTabValue] = useState(0);
  const [orders, setOrders] = useState({
    pending: [],
    bought: [],
    sold: []
  });
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info"
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get("http://localhost:5000/api/orders/history", {
        headers: { Authorization: `Bearer ${token}` },
      });

     
      const pendingOrders = response.data.bought.filter(order => order.status === "pending");
      const completedBoughtOrders = response.data.bought.filter(order => order.status === "completed");

      setOrders({
        pending: pendingOrders,
        bought: completedBoughtOrders,
        sold: response.data.sold
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error fetching orders",
        severity: "error"
      });
    }
    setLoading(false);
  };

  const regenerateOtp = async (orderId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "http://localhost:5000/api/orders/regenerate-otp",
        { orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      
      setOrders(prev => ({
        ...prev,
        pending: prev.pending.map(order => 
          order._id === orderId 
            ? { ...order, originalOtp: response.data.otp }
            : order
        )
      }));

      setSnackbar({
        open: true,
        message: `New OTP generated: ${response.data.otp}`,
        severity: "success"
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error regenerating OTP",
        severity: "error"
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <>
        <MenuAppBar />
        <Box sx={{ p: 4 }}>
          <Typography>Loading...</Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <MenuAppBar />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Order History</Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Pending Orders" />
            <Tab label="Completed Purchases" />
            <Tab label="Sold Items" />
          </Tabs>
        </Box>

        {/* Pending Orders Tab */}
        {tabValue === 0 && (
          <Box>
            {orders.pending.length === 0 ? (
              <Typography>No pending orders.</Typography>
            ) : (
              orders.pending.map((order) => (
                <Card key={order._id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6">Item: {order.itemId?.name}</Typography>
                    <Typography>Price: ₹{order.itemId?.price}</Typography>
                    <Typography>Seller: {order.sellerId?.email}</Typography>
                    <Typography color="primary">
                      OTP for delivery: {order.originalOtp}
                    </Typography>
                    <Button 
                      variant="outlined"
                      size="small"
                      onClick={() => regenerateOtp(order._id)}
                      sx={{ mt: 1 }}
                    >
                      Regenerate OTP
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        )}

        {/* Completed Purchases Tab */}
        {tabValue === 1 && (
          <Box>
            {orders.bought.length === 0 ? (
              <Typography>No completed purchases.</Typography>
            ) : (
              orders.bought.map((order) => (
                <Card key={order._id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6">Item: {order.itemId?.name}</Typography>
                    <Typography>Price: ₹{order.itemId?.price}</Typography>
                    <Typography>Seller: {order.sellerId?.email}</Typography>
                    <Typography color="success.main">Status: Completed</Typography>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        )}

        {/* Sold Items Tab */}
        {tabValue === 2 && (
          <Box>
            {orders.sold.length === 0 ? (
              <Typography>No items sold.</Typography>
            ) : (
              orders.sold.map((order) => (
                <Card key={order._id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6">Item: {order.itemId?.name}</Typography>
                    <Typography>Price: ₹{order.itemId?.price}</Typography>
                    <Typography>Buyer: {order.buyerId?.email}</Typography>
                    <Typography color={order.status === "completed" ? "success.main" : "warning.main"}>
                      Status: {order.status}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
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
}
