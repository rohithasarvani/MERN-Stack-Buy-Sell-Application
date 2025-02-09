import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import axios from "axios";

export const EditForm = ({ formData, setFormData, user }) => {
  const [isEditing, setIsEditing] = useState(true);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    
    axios
      .put("http://localhost:5000/api/users/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setIsEditing(false); 
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  if (!isEditing) {
    return (
      <div>
        <h3>Profile Updated Successfully</h3>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.href = "/profile"}
        >
          Go to Profile
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <TextField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          fullWidth
        />
      </div>
      <div>
        <TextField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          fullWidth
        />
      </div>
      <div>
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
        />
      </div>
      <div>
        <TextField
          label="Age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          fullWidth
        />
      </div>
      <div>
        <TextField
          label="Contact Number"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          fullWidth
        />
      </div>
      <div>
        <TextField
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          type="password"
        />
      </div>
      <Button type="submit" variant="contained" color="primary">
        Save Changes
      </Button>
    </form>
  );
};
