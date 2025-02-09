// profile.jsx
import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";  // Import Material UI Button component
import { LogoutButton } from "./auth.jsx";
import axios from "axios";
import MenuAppBar from "./components/navbar.jsx";
function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    contactNumber: "",
    password: "",
  });


  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      window.location.href = "/auth/login";
    } else {
      
    axios
    .get("http://localhost:5000/api/users/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      setUser(response.data.user);
      setFormData({
        firstName: response.data.user.firstName,
        lastName: response.data.user.lastName,
        email: response.data.user.email,
        age: response.data.user.age,
        contactNumber: response.data.user.contactNumber,
        password: "", 
      });
    })
    .catch(() => {
      localStorage.removeItem("authToken"); 
      window.location.href = "/auth/login";
    });
}
}, []);
const handleEditClick = () => {
  setIsEditing(true);
};

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
      setUser(response.data.user);
      setIsEditing(false); 
    })
    .catch((error) => {
      console.error("Error updating profile:", error);
    });
};
if (!user) return <div>Loading...</div>;

return (
  <div>
    <MenuAppBar/>
    <h1>Welcome, {user.firstName} {user.lastName}</h1>
    <p>Email: {user.email}</p>
    <p>First name: {user.firstName}</p>
    <p>Last name: {user.lastName}</p>
    <p>Phone no: {user.contactNumber}</p>
    <p>Age: {user.age}</p>

    <LogoutButton />

  
    <Button variant="outlined" onClick={handleEditClick}>
      Edit
    </Button>

   
    {isEditing && (
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="text"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Contact Number:</label>
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    )}
  </div>
);
}

export default ProfilePage;