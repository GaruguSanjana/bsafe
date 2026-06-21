const Alert = require('../models/Alert');

// Create SOS Alert
exports.createAlert = async (req, res) => {
  try {
    const { latitude, longitude, address, description } = req.body;

    const alert = await Alert.create({
      user: req.user.userId,
      location: { latitude, longitude, address },
      description
    });

    res.status(201).json({ message: 'SOS Alert created!', alert });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all active alerts (for volunteers)
exports.getActiveAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ status: 'active' })
      .populate('user', 'name phone');

    res.json({ alerts });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Accept alert (volunteer)
exports.acceptAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { status: 'assigned', responder: req.user.userId },
      { new: true }
    );

    res.json({ message: 'Alert accepted!', alert });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Resolve alert
exports.resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { status: 'resolved' },
      { new: true }
    );

    res.json({ message: 'Alert resolved!', alert });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's own alerts
exports.getMyAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ user: req.user.userId })
      .sort({ createdAt: -1 });

    res.json({ alerts });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Admin: get all alerts + stats
exports.getAllAlertsAdmin = async (req, res) => {
  try {
    const alerts = await Alert.find()
      .populate('user', 'name phone')
      .populate('responder', 'name phone')
      .sort({ createdAt: -1 });

    const stats = {
      total: alerts.length,
      active: alerts.filter(a => a.status === 'active').length,
      assigned: alerts.filter(a => a.status === 'assigned').length,
      resolved: alerts.filter(a => a.status === 'resolved').length
    };

    res.json({ alerts, stats });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};