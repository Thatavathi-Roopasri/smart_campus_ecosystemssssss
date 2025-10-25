const mongoose = require('mongoose');

const LostFoundSchema = new mongoose.Schema({
  type: { type: String, enum: ['lost', 'found'], required: true },
  title: { type: String, required: true },
  description: String,
  category: { type: String, default: 'other' },
  imageData: String, // base64 for MVP; replace with URL in production
  whereText: String,
  timeReported: { type: Date, default: Date.now },
  status: { type: String, enum: ['open', 'claimed', 'collected', 'closed'], default: 'open' }
}, { timestamps: true });

module.exports = mongoose.model('LostFound', LostFoundSchema);
