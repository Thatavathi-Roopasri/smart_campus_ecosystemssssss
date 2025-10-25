const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'hod', 'admin'], default: 'student' },
  name: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
