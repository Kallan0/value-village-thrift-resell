const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  condition: { type: String, required: true },
  imageUrl: { 
    type: [String],
    required: true,
    validate: [arrayLimit, '{PATH} exceeds the limit of 5']
  },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // --- FIELDS FOR ADMIN MODERATION ---
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], // It can ONLY be one of these three words
    default: 'pending' // Every new upload starts here automatically!
  },
  rejectionReason: { 
    type: String,
    default: "" // Starts empty
  }

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
function arrayLimit(val) {
  return val.length <= 5; // Limit to 5 images per product
}

