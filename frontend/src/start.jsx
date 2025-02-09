import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

const HomePage = () => {
  const navigate = useNavigate(); 

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url('https://source.unsplash.com/1600x900/?ecommerce,shopping')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        textAlign: "center",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          color: "white",
          fontWeight: "bold",
          mb: 4,
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
        }}
      >
        Welcome to Buy & Sell
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: "bold",
            textTransform: "none",
          }}
          onClick={() => navigate("/auth/login")} 
        >
          Login
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: "bold",
            textTransform: "none",
          }}
          onClick={() => navigate("/auth/signup")} 
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
