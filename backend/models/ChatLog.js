const mongoose = require("mongoose");

const chatLogSchema = new mongoose.Schema({

    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false},
    question: {type: String, required: true},
    answer: {type: String, required: true},
    feedback: {
        type: String, enum: ['good', 'bad', 'none'], default: 'none'}
    },{timestamps: true});
module.exports = mongoose.model("ChatLog", chatLogSchema);