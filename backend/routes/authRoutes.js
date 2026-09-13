// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');
const { admin, isFirebaseAdminReady } = require('../config/firebaseAdmin');
const sendEmail = require('../utils/sendEmail');

// In-memory store for pending OTP registrations
const pendingRegistrations = new Map();

// Helper to generate a clean safe user object
function sanitizeUser(user) {
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    name: `${user.firstName} ${user.lastName || ''}`.trim(),
    email: user.email,
    role: user.role,
    phone: user.phone || '',
    avatarUrl: user.avatarUrl || `https://avatar.vercel.sh/${encodeURIComponent(user.email)}`,
    imageUrl: user.avatarUrl || `https://avatar.vercel.sh/${encodeURIComponent(user.email)}`,
    isPremium: user.isPremium || false,
    shippingAddress: user.shippingAddress || {},
    authProvider: user.authProvider || 'local'
  };
}

// Generate JWT token
function generateToken(user) {
  return jwt.sign(
    { userId: user._id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// --- 1. LOCAL LOGIN ROUTE ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Check if account was created via social login without a password
    if (user.authProvider !== 'local' && !user.password) {
      return res.status(400).json({
        message: `This account was registered using ${user.authProvider.toUpperCase()}. Please sign in with ${user.authProvider.toUpperCase()}.`
      });
    }

    // Support both hashed passwords and legacy plain-text passwords
    let isMatch = false;
    if (user.password && user.password.startsWith('$2')) {
      isMatch = await user.comparePassword(cleanPassword);
    } else if (user.password === cleanPassword) {
      // Legacy plaintext password matched: auto-migrate to bcrypt hash!
      isMatch = true;
      user.password = cleanPassword;
      await user.save();
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    res.status(200).json({
      message: 'Login successful!',
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// --- 2. REQUEST OTP ---
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

router.post('/request-otp', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!firstName || !cleanEmail || !password) {
      return res.status(400).json({ message: 'Please fill in all registration fields.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const otp = generateOtp();
    pendingRegistrations.set(cleanEmail, {
      firstName,
      lastName: lastName || '',
      email: cleanEmail,
      password,
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    console.log(`🔐 OTP for ${cleanEmail}: ${otp}`);

    // Attempt to send email if SMTP credentials are configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await sendEmail({
          email: cleanEmail,
          subject: 'Your Value Village Verification Code',
          message: `Your verification code is ${otp}. It expires in 10 minutes.`,
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
              <h2 style="color: #43281C;">Welcome to Value Village!</h2>
              <p>Please enter the code below to complete your registration:</p>
              <div style="background: #fdfbf7; border: 1px dashed #43281C; font-size: 28px; font-weight: bold; letter-spacing: 4px; padding: 12px; text-align: center; color: #C8342A;">
                ${otp}
              </div>
              <p style="color: #666; font-size: 12px; margin-top: 20px;">This code expires in 10 minutes. If you did not request this, please ignore this email.</p>
            </div>
          `
        });
      } catch (mailErr) {
        console.warn('⚠️ Could not send verification email via Gmail:', mailErr.message);
      }
    }

    res.status(200).json({ message: 'OTP sent. Enter the code to complete registration.' });
  } catch (error) {
    console.error('Request OTP Error:', error);
    res.status(500).json({ message: 'Server error while sending OTP.' });
  }
});

// --- 3. VERIFY OTP & REGISTER ---
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();
    const pending = pendingRegistrations.get(cleanEmail);

    if (!pending) {
      return res.status(400).json({ message: 'No pending registration found. Please request a new OTP.' });
    }

    if (pending.expiresAt < Date.now()) {
      pendingRegistrations.delete(cleanEmail);
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (pending.otp !== (otp || '').trim()) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    pendingRegistrations.delete(cleanEmail);

    const newUser = new User({
      firstName: pending.firstName,
      lastName: pending.lastName,
      email: pending.email,
      password: pending.password,
      authProvider: 'local'
    });

    await newUser.save();

    const token = generateToken(newUser);
    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: sanitizeUser(newUser)
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ message: 'Server error during verification.' });
  }
});

// --- 4. FIREBASE SOCIAL AUTH (GOOGLE & APPLE) ---
router.post('/firebase', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'Firebase ID token is required.' });
    }

    if (!isFirebaseAdminReady()) {
      return res.status(503).json({
        message: 'Firebase Admin is not configured on the backend yet. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.'
      });
    }

    // Verify token with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture, firebase } = decodedToken;

    if (!email) {
      return res.status(400).json({ message: 'No email associated with this social account.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const signInProvider = firebase?.sign_in_provider || 'google.com';
    const authProvider = signInProvider.includes('apple') ? 'apple' : 'google';

    // Check if user exists by firebaseUid or email
    let user = await User.findOne({
      $or: [{ firebaseUid: uid }, { email: cleanEmail }]
    });

    if (user) {
      // Link firebaseUid if it was created via email or earlier
      let changed = false;
      if (!user.firebaseUid) {
        user.firebaseUid = uid;
        changed = true;
      }
      if (!user.avatarUrl && picture) {
        user.avatarUrl = picture;
        changed = true;
      }
      if (changed) await user.save();
    } else {
      // Split name into first and last
      const nameParts = (name || 'Thrifter').trim().split(' ');
      const firstName = nameParts[0] || 'Thrifter';
      const lastName = nameParts.slice(1).join(' ') || '';

      user = new User({
        firstName,
        lastName,
        email: cleanEmail,
        authProvider,
        firebaseUid: uid,
        avatarUrl: picture || '',
        role: 'user'
      });

      await user.save();
    }

    const token = generateToken(user);
    res.status(200).json({
      message: `Signed in successfully via ${authProvider.toUpperCase()}!`,
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('Firebase Auth Error:', error);
    res.status(401).json({ message: 'Failed to verify social sign-in token.', error: error.message });
  }
});

module.exports = { router, sanitizeUser };
