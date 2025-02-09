
import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';

const ItemCard = ({ item }) => {
  return (
    <Card sx={{ maxWidth: 345, margin: 2 }}>
      <CardMedia
        component="img"
        height="140"
        image="/static/images/cards/item-image.jpg" 
        alt="item image"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {item.itemName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {item.description}
        </Typography>
        <Typography variant="h6" color="text.primary">
          ${item.price}
        </Typography>
        <Box mt={2}>
          
        </Box>
      </CardContent>
    </Card>
  );
};

export default ItemCard;