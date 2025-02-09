import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { EditForm } from "./components/EditForm";
import MenuAppBar from "./components/navbar.jsx";

const EditPage = () => {
  const [user, setUser] = useState(null);
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

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <MenuAppBar />
      <h1>Edit Your Profile</h1>
      <EditForm formData={formData} setFormData={setFormData} user={user} />
    </div>
  );
};

export default EditPage;
