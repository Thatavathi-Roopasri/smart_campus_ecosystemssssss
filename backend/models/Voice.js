const mongoose = require('mongoose');

const VoiceSchema = new mongoose.Schema({
  content: { type: String, required: true },
  imageData: String
}, { timestamps: true });

module.exports = mongoose.model('Voice', VoiceSchema);
