const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  // Optional but highly recommended: Allows you to hide a question without deleting it
  isActive: { type: Boolean, default: true }, 
  // Determines what order they appear in the chatbot menu
  order: { type: Number, default: 0 } 
});

module.exports = mongoose.model('Faq', faqSchema);

