const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'volunteer', 'admin'],
    default: 'user'
  },
  emergencyContacts: [
    {
      name: String,
      phone: String,
      relation: String
    }
  ],
  safetyProfile: {
    bloodGroup: { type: String, default: '' },
    address: { type: String, default: '' },
    medicalNotes: { type: String, default: '' },
    age: { type: Number },
    photoUrl: { type: String, default: '' }
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);