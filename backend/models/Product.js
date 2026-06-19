const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number }, // Optional: so we can calculate "Save % vs retail"
  category: { type: String, required: true }, // e.g., "Women's", "Vintage", "Shoes"
  condition: { type: String, required: true }, // e.g., "Like New", "Good", "Fair"
  imageUrl: { type: String, required: true }, // We will store the Cloudinary URL here
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // This creates a hard link to the User model!
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);