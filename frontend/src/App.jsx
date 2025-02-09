import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./start.jsx";
import AuthPage from "./auth.jsx";
import ProfilePage from "./profile.jsx"; 
import { Navigate } from "react-router-dom";

import Sell from "./sell.jsx"; 
import Buy from "./buy.jsx";  
import Search from "./search.jsx";
import ItemDetails from "./ItemDetails.jsx";
import Cart from "./cart.jsx";  
import DeliverItems from "./DeliverItems.jsx";

import Support from "./Support.jsx"; 
import OrderHistory from "./OrderHistory.jsx"; 



function PrivateRoute({ element, ...rest }) {
  const token = localStorage.getItem("authToken");

  return token ? element : <Navigate to="/auth/login" />;
}

function App() {
  return (<><Router>
   
    <Routes>

    
      <Route path="/" element={<HomePage />} />
     
      <Route path="/auth/login" element={<AuthPage mode="login" />} />
      <Route path="/auth/signup" element={<AuthPage mode="signup" />} />
     
      <Route
        path="/profile"
        element={<PrivateRoute element={<ProfilePage />} />}
      />
     <Route path="/item/:id" element={<ItemDetails />} /> Item details page
      <Route path="/sell" element={<Sell/>} />
      <Route path="/buy" element={<Buy/>} />
      <Route path="/search" element={<Search />} />
      <Route path="/cart" element={<PrivateRoute element={<Cart />} />} /> 
      <Route path="/deliver" element={<PrivateRoute element={<DeliverItems />} />} />
<Route path="/orders" element={<PrivateRoute element={<OrderHistory />} />} />
<Route path="/support" element={<PrivateRoute element={<Support />} />} />


    </Routes>
  </Router>
  
  </>
    
  );
}

export default App;
