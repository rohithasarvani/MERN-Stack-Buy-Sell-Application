const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


const mongoURI = process.env.MONGO_URI;
const cookieParser = require('cookie-parser');

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true, 
  })
);


mongoose
  .connect(mongoURI, {
    tls: true, 
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));


app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/items', require('./routes/items'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/support', require('./routes/support'));





app.listen(port, () => console.log(`Server running on port ${port}`));
