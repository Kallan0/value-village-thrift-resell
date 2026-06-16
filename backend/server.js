require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const productRoutes = require('./routes/productRoutes');
const User = require('./models/User'); // Import the blueprint you just made


// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/value-village')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('Database connection error:', err));

// Routes
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// backend/server.js
// --- THE LOGIN ROUTE ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Search MongoDB for a user with this email
    const user = await User.findOne({ email: email });

    // 2. If no user is found, or password doesn't match (keeping it simple for now)
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Success! Send the user data back to the frontend
    res.status(200).json({ 
      message: "Login successful!", 
      user: { id: user._id, name: user.firstName, role: user.role } 
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
// --- THE REGISTER ROUTE ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // 1. Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    // 2. Create the new user and save to MongoDB
    // Note: In a production app, you would hash this password using bcrypt!
    const newUser = new User({ firstName, lastName, email, password });
    await newUser.save();

    // 3. Success! Send the user data back
    res.status(201).json({ 
      message: "Account created successfully!", 
      user: { id: newUser._id, name: newUser.firstName, role: newUser.role } 
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
});