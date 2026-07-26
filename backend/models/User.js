// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
     type: String,
      required: true,
       unique: true, match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, lowercase: true, trim: true
     },
  password: { type: String, required: true, minlength: 6, maxlength: 20 },
  role: { type: String, default: 'user' } // This sets up your admin powers for later!
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);