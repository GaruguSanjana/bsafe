const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String }
  },
  status: {
    type: String,
    enum: ['active', 'assigned', 'resolved', 'cancelled'],
    default: 'active'
  },
  responder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  description: {
    type: String,
    default: 'SOS Emergency Alert'
  }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);