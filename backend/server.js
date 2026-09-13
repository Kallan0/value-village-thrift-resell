require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const productRoutes = require('./routes/productRoutes');
const User = require('./models/User'); // Import the blueprint you just made

const Product = require('./models/Product');
const upload = require('./middleware/upload');
const ChatLog = require('./models/ChatLog');

const sendEmail = require('./utils/sendEmail'); // Import the email utility

const pendingRegistrations = new Map();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);
app.use(cors({ origin: allowedOrigins }));
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

    // Prevent crashes if email/password are somehow undefined
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password." });
    }

    // 2. Clean the input (remove accidental spaces)
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    // 3. Search MongoDB (using Regex to make it case-insensitive!)
    const user = await User.findOne({ email: new RegExp('^' + cleanEmail + '$', 'i') });

    if (!user) {
      console.log("❌ DB FOUND NOBODY matching that email.");
    }

    // 5. Compare the passwords
    if (!user || user.password !== cleanPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Success! Send the user data back to the frontend
    res.status(200).json({ 
      message: "Login successful!", 
      user: { _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role } 
    });

  } catch (error) {
    console.error("Login Server Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

app.post('/api/auth/request-otp', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!firstName || !lastName || !cleanEmail || !password) {
      return res.status(400).json({ message: 'Please fill in all registration fields.' });
    }

    const existingUser = await User.findOne({ email: new RegExp('^' + cleanEmail + '$', 'i') });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const otp = generateOtp();
    pendingRegistrations.set(cleanEmail, {
      firstName,
      lastName,
      email: cleanEmail,
      password,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    console.log(`🔐 OTP for ${cleanEmail}: ${otp}`);
    res.status(200).json({ message: 'OTP sent. Enter the code to complete registration.' });
  } catch (error) {
    console.error('Request OTP Error:', error);
    res.status(500).json({ message: 'Server error while sending OTP.' });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();
    const pendingRegistration = pendingRegistrations.get(cleanEmail);

    if (!pendingRegistration) {
      return res.status(400).json({ message: 'No pending registration found. Please request a new OTP.' });
    }

    if (pendingRegistration.expiresAt < Date.now()) {
      pendingRegistrations.delete(cleanEmail);
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (pendingRegistration.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    pendingRegistrations.delete(cleanEmail);

    const newUser = new User({
      firstName: pendingRegistration.firstName,
      lastName: pendingRegistration.lastName,
      email: pendingRegistration.email,
      password: pendingRegistration.password
    });

    await newUser.save();

    res.status(201).json({
      message: 'Account created successfully!',
      user: { _id: newUser._id, firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ message: 'Server error during verification.' });
  }
});

// --- UPLOAD NEW PRODUCT ROUTE ---
// The "upload.array('images', 5)" middleware automatically intercepts the files, 
// uploads them to Cloudinary, and attaches the URLs to req.files
app.post('/api/products', (req, res) => {
  
  // 1. The Trap: We move Multer INSIDE the route so we can catch its errors
  const uploadMiddleware = upload.array('images', 5);

  uploadMiddleware(req, res, async (err) => {
    
    // 2. Catch Cloudinary / File Size Errors instantly
    if (err) {
      console.error("❌ CLOUDINARY UPLOAD ERROR:", err.message);
      return res.status(400).json({ 
        message: "Image upload failed. File might be too large (over 10MB) or an invalid format.",
        error: err.message
      });
    }

    // 3. If Cloudinary succeeds, run your original logic!
    try {
      console.log("=== NEW UPLOAD REQUEST ===");
      console.log("👉 FILES CAUGHT BY MULTER:", req.files);
      console.log("👉 TEXT DATA SENT:", req.body);

      if (!req.files || req.files.length === 0) {
        console.log("Error: multer saw no images. ");
        return res.status(400).json({ message: "At least one image is required." });
      }

      // Grab the Cloudinary URLs generated by Multer
      const imageUrls = req.files.map(file => file.path);
      
      // --- 🚨 THE EXTRA SAFETY BOUNCER 🚨 ---
      // Forcefully stop the save if Cloudinary gave us a broken or empty link
      const hasBadUrls = imageUrls.some(url => !url || !url.startsWith('http'));
      if (hasBadUrls) {
        console.log("❌ Error: Cloudinary returned a broken URL.", imageUrls);
        return res.status(400).json({ message: "Cloudinary failed to process the image correctly. Try a smaller file." });
      }

      console.log("✅ Cloudinary URLs generated:", imageUrls);

      // Grab the rest of the text data from the frontend form
      const { name, description, price, category, condition,imageUrl, sellerId } = req.body;

      // Product blueprint 
      const newProduct = new Product({
        name,
        description,
        price,
        category,
        condition,
        imageUrl: imageUrls, 
        seller: sellerId 
      });

      // Save to MongoDB
      await newProduct.save();
      console.log("✅ New product saved to MongoDB!");

      res.status(201).json({ 
        message: "Item added to your closet successfully!", 
        product: newProduct 
      });

    } catch (error) {
      console.error("❌ Backend crash", error);
      res.status(500).json({ message: "Failed to upload product to database." });
    }
  });
});

// --- DEAD CODE REMOVED: inline GET /api/products duplicated the mounted router ---

// --- ADMIN: GET ALL PRODUCTS (FOR DASHBOARD) ---
app.get('/api/admin/products', async (req, res) => {
  console.log("🚀 ADMIN DASHBOARD FETCH TRIGGERED!");
  try {
    const allProducts = await Product.find()
      .populate('seller', 'firstName email')
      .sort({ createdAt: -1 });
      
    console.log(`📦 Success! Found ${allProducts.length} items in the database.`);
    res.status(200).json(allProducts);
  } catch (error) {
    console.error("❌ Fetch Admin Dashboard Error:", error);
    res.status(500).json({ message: "Failed to fetch admin dashboard data." });
  }
});
// -- Chatbot LOGS --
app.post('/api/chat/log', async (req, res) => {
  try{
      const {userId, question, answer} = req.body;

      const newLog =new ChatLog({
        user: userId || null,
        question,
        answer
      });
  const savedLog = await newLog.save();

  res.status(200).json({ logId: savedLog._id });
  } catch (error) {
    console.error("❌ Chatbot Log Error:", error);
    res.status(500).json({ message: "Failed to save chatbot log." });
  }
});

app.patch('/api/chat/feedback/:id', async (req, res) => {
  try{
    const {feedback} = req.body;

    await ChatLog.findByIdAndUpdate(req.params.id, {feedback});

    res.status(200).json({message: "Feedback updated successfully."});
  } catch(error) {
    console.error("Feedback error", error);
    res.status(500).json({message: "Failed to update feedback."});
  }
});

// --- ADMIN: APPROVE / REJECT A PRODUCT ---
app.patch('/api/admin/products/:id', async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { status, rejectionReason: status === 'rejected' ? (rejectionReason || '') : '' },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Product not found.' });
    res.status(200).json(updated);
  } catch (error) {
    console.error("Admin product update error:", error);
    res.status(500).json({ message: "Failed to update product status." });
  }
});

const Faq = require('./models/Faq');

// --- GET ALL ACTIVE FAQS ---
app.get('/api/chat/faqs', async (req, res) => {
  try {
    // Only grab questions marked 'isActive: true' and sort them by the 'order' number
    const faqs = await Faq.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json(faqs);
  } catch (error) {
    console.error("Failed to fetch FAQs:", error);
    res.status(500).json({ message: "Failed to load knowledge base" });
  }
});
// --- CREATE NEW FAQ ---
app.post('/api/chat/faqs', async (req, res) => {
  try {
    const { question, answer, order, isActive } = req.body;
    const newFaq = new Faq({ question, answer, order, isActive });
    await newFaq.save();
    res.status(201).json(newFaq);
  } catch (error) {
    res.status(500).json({ message: "Failed to create FAQ" });
  }
});

// --- UPDATE FAQ ---
app.put('/api/chat/faqs/:id', async (req, res) => {
  try {
    const updatedFaq = await Faq.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } // Returns the updated document
    );
    res.status(200).json(updatedFaq);
  } catch (error) {
    res.status(500).json({ message: "Failed to update FAQ" });
  }
});

// --- DELETE FAQ ---
app.delete('/api/chat/faqs/:id', async (req, res) => {
  try {
    await Faq.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete FAQ" });
  }
});
