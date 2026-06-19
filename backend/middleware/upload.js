// backend/middleware/upload.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config(); // Ensure it can read your .env file

// 1. Log in to your Cloudinary account using your .env credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Tell Cloudinary where to put the files and what types are allowed
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'value-village-products', // This will create a neat folder in your Cloudinary dashboard!
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp']
  }
});

// 3. Create the Multer tollbooth using those rules
const upload = multer({ storage: storage });

module.exports = upload;