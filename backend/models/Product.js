const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  emoji: { type: String, default: '👗' },
  meta: { type: String, required: true }, // e.g., "Size M · Like new"
  priceNow: { type: Number, required: true },
  priceWas: { type: Number, required: true },
  savePercentage: { type: Number },
  category: { type: String, required: true },
  badge: {
    type: { type: String, enum: ['hot', 'thrift', 'new', 'none'], default: 'none' },
    text: { type: String }
  },
  inStock: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);