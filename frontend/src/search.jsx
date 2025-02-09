import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Checkbox, FormControlLabel, Button, Grid, Box, Typography } from "@mui/material";
import ItemCard from "./components/Card.jsx";
import MenuAppBar from "./components/navbar.jsx";
import { useNavigate } from "react-router-dom"; 

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); 
 
  const availableCategories = ["Electronics", "book", "Clothing", "Furniture", "Others"];

  useEffect(() => {
    fetchItems();
  }, []);

 
  const fetchItems = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
  
      let query = `?search=${searchQuery}`;
      if (selectedCategories.length > 0) {
        query += `&categories=${selectedCategories.join(",")}`;
      }
  
      const response = await axios.get(`http://localhost:5000/api/items${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
      setItems([]);
    }
    setLoading(false);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((c) => c !== category) 
        : [...prevCategories, category] 
    );
  };

  
  const handleKnowMore = (itemId) => {
    console.log(itemId); 
    navigate(`/item/${itemId}`); 
  };

  return (
    <>
      <MenuAppBar />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4">Search Items</Typography>

       
        <TextField
          fullWidth
          label="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          margin="normal"
        />

        
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
          {availableCategories.map((category) => (
            <FormControlLabel
              key={category}
              control={
                <Checkbox
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
              }
              label={category}
            />
          ))}
        </Box>

     
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={fetchItems}>
          Search
        </Button>

      
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <Grid container spacing={2} sx={{ mt: 4 }}>
            {items.length > 0 ? (
              items.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                  <ItemCard item={item} />
                  
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 1 }}
                    onClick={() => handleKnowMore(item._id)} // Redirect to item details page
                  >
                    Know More
                  </Button>
                </Grid>
              ))
            ) : (
              <Typography>No items found</Typography>
            )}
          </Grid>
        )}
      </Box>
    </>
  );
};

export default Search;
