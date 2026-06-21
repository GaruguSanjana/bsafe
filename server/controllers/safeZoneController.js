const SafeZone = require('../models/SafeZone');

// Get all active safe zones
exports.getSafeZones = async (req, res) => {
  try {
    const zones = await SafeZone.find({ isActive: true });
    res.json({ zones });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a safe zone (admin only)
exports.createSafeZone = async (req, res) => {
  try {
    const { name, type, latitude, longitude, address, phone } = req.body;

    const zone = await SafeZone.create({
      name,
      type,
      location: { latitude, longitude },
      address,
      phone
    });

    res.status(201).json({ message: 'Safe zone created', zone });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};