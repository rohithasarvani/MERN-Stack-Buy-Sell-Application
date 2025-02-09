
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Box, Typography } from '@mui/material';
import ItemCard from './components/Card.jsx';  
import MenuAppBar from "./components/navbar.jsx";
const Buy = () => {
  const [items, setItems] = useState([]); 
  const [loading, setLoading] = useState(true); 

  
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const response = await axios.get('http://localhost:5000/api/items', {
          headers: { Authorization: `Bearer ${token}` }, 
        });
        
        setItems(response.data); 
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching items:', error);
        setLoading(false); 
      }
    };

    fetchItems();
  }, []); 

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <>  <MenuAppBar/>
    <Box sx={{ padding: 4 }}>
    <Typography variant="h4" gutterBottom>
      Available Items
    </Typography>
    <Grid container spacing={2}>
      
      {items.length > 0 ? (
        items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <ItemCard item={item} />
          </Grid>
        ))
      ) : (
        <Typography>No items available</Typography> 
      )}
    </Grid>
  </Box></>
    
  );
};

export default Buy;
