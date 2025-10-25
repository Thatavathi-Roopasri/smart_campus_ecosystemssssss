const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  posterUrl: String,
  venue: String,
  startAt: { type: Date, required: true },
  interestedRolls: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
