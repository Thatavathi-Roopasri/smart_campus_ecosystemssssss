const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  category: { type: String, default: 'other' },
  description: String,
  imageData: String,
  status: { type: String, enum: ['open', 'in_progress', 'resolved', 'rejected'], default: 'open' }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', FeedbackSchema);
