// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const { requireAuth } = require('../middleware/auth');
const { sanitizeUser } = require('./authRoutes');

// --- 1. GET CURRENT USER PROFILE ---
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(sanitizeUser(user));
  } catch (error) {
    console.error('Fetch profile error:', error);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
});

// --- 2. UPDATE PROFILE ---
router.patch('/profile', requireAuth, async (req, res) => {
  try {
    const { name, phone, avatarUrl, shippingAddress } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) {
      const parts = name.trim().split(' ');
      user.firstName = parts[0] || user.firstName;
      user.lastName = parts.slice(1).join(' ');
    }

    if (phone !== undefined) user.phone = phone;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
    if (shippingAddress && typeof shippingAddress === 'object') {
      user.shippingAddress = {
        ...user.shippingAddress,
        ...shippingAddress
      };
    }

    await user.save();
    res.status(200).json({
      message: 'Profile updated successfully!',
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// --- 3. GET SELLER'S OWN LISTINGS ---
router.get('/my-listings', requireAuth, async (req, res) => {
  try {
    const items = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    console.error('Fetch seller listings error:', error);
    res.status(500).json({ message: 'Failed to fetch your listings' });
  }
});

module.exports = router;
