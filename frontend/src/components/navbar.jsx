import React, { useState } from "react";
import { AppBar, Box, Toolbar, Typography, IconButton, Menu, MenuItem, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null);
  const [auth, setAuth] = useState(true); 

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMobileMenuOpen(null);
  };

  const handleMobileMenu = (event) => {
    setMobileMenuOpen(event.currentTarget);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ display: { xs: "block", md: "none" } }} onClick={handleMobileMenu}>
            <MenuIcon />
          </IconButton>

        
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: { xs: "center", md: "left" } }}>
            IIIT Buy-Sell
          </Typography>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>

            <Button color="inherit" component={Link} to="/profile">Profile</Button>
            <Button color="inherit" component={Link} to="/sell">Sell</Button>  
            <Button color="inherit" component={Link} to="/search">Search Items</Button>
            <Button color="inherit" component={Link} to="/orders">Orders History</Button>
            <Button color="inherit" component={Link} to="/deliver">Deliver Items</Button>
            <Button color="inherit" component={Link} to="/cart">My Cart</Button>
            <Button color="inherit" component={Link} to="/support">Support</Button>
          </Box>

          
          {auth && (
            <IconButton size="large" aria-label="account" onClick={handleMenu} color="inherit">
              <AccountCircle />
            </IconButton>
          )}

          
          <Menu anchorEl={anchorEl} anchorOrigin={{ vertical: "top", horizontal: "right" }} keepMounted transformOrigin={{ vertical: "top", horizontal: "right" }} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={handleClose} component={Link} to="/profile">Profile</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
            <MenuItem onClick={handleClose} component={Link} to="/edit-profile">Edit Profile</MenuItem>
          </Menu>

          
          <Menu anchorEl={mobileMenuOpen} anchorOrigin={{ vertical: "top", horizontal: "left" }} keepMounted transformOrigin={{ vertical: "top", horizontal: "left" }} open={Boolean(mobileMenuOpen)} onClose={handleClose} sx={{ display: { xs: "block", md: "none" } }}>

            <MenuItem onClick={handleClose} component={Link} to="/profile">Profile</MenuItem>
            <MenuItem onClick={handleClose} component={Link} to="/sell">Sell</MenuItem>  
            <MenuItem onClick={handleClose} component={Link} to="/search">Search Items</MenuItem>
            <MenuItem onClick={handleClose} component={Link} to="/orders">Orders History</MenuItem>
            <MenuItem onClick={handleClose} component={Link} to="/deliver">Deliver Items</MenuItem>
            <MenuItem onClick={handleClose} component={Link} to="/cart">My Cart</MenuItem>
            <MenuItem onClick={handleClose} component={Link} to="/support">Support</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
