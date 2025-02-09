import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Box, TextField, Button, Typography, Paper, Grid } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const SITE_KEY = "6LczxM0qAAAAADLaeywpiE1HN4f77Ev5KqGhgmhf"; 
const LoginBox = ({ onSubmit }) => {
  console.log("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const navigate = useNavigate(); 

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      alert("Please complete the CAPTCHA.");
      return;
    }
    try {

      const response = await axios.post('http://localhost:5000/api/users/login', { email, password },{ withCredentials: true });
      
      const token = response.data.token;
      localStorage.setItem("authToken", token);
      alert("Login successful!");
      navigate("/profile");
      
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 2,
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleLoginSubmit} 
    >
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        fullWidth
        required
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        fullWidth
        required
      />
      <ReCAPTCHA sitekey={SITE_KEY} onChange={(token) => setCaptchaToken(token)} />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Log In
      </Button>
    </Box>
  );
};
export const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    alert("Logged out successfully!");
    navigate("/auth/login");
  };

  return (
    <Button onClick={handleLogout} variant="contained" color="secondary">
      Log Out
    </Button>
  );
};


const SignUpBox = () => {
  const [firstName, setFirstName] = useState("");
 
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const navigate = useNavigate(); 

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      alert("Please complete the CAPTCHA.");
      return;
    }
    if (!email.includes("@students.iiit")) {
      alert("Access allowed to IIIT Hyderabad members only.");
      return;
    }
    

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("packing");
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', {
        firstName,
        lastName,
        email,
        password,
        age,
        contactNumber,
      });
      alert("Sign Up successful!");
      navigate("/auth/login"); 
    } catch (error) {
      alert(error.response?.data?.message || "Sign Up failed");
    }
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 2,
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleSignUpSubmit} 
    >
      <TextField
        label="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="Enter your first name"
        fullWidth
        required
      />
      <TextField
        label="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Enter your last name"
        fullWidth
        required
      />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        fullWidth
        required
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        fullWidth
        required
      />
      <TextField
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Re-enter your password"
        fullWidth
        required
      />
      <TextField
        label="Age"
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder="Enter your age"
        fullWidth
      />
      <TextField
        label="Contact Number"
        type="tel"
        value={contactNumber}
        onChange={(e) => setContactNumber(e.target.value)}
        placeholder="Enter your contact number"
        fullWidth
      />
      <ReCAPTCHA sitekey={SITE_KEY} onChange={(token) => setCaptchaToken(token)} />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Sign Up
      </Button>
    </Box>
  );
};


const AuthPage = ({ mode }) => {
  const isSignup = mode === "signup";

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}
    >
      <Paper elevation={3} style={{ padding: "32px", maxWidth: "400px", width: "100%" }}>
        <Typography variant="h4" align="center" gutterBottom>
          {isSignup ? "Sign Up" : "Log In"}
        </Typography>
        {isSignup ? <SignUpBox /> : <LoginBox />}
      </Paper>
    </Grid>
  );
};

export default AuthPage;
