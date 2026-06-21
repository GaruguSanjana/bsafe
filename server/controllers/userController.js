const User = require('../models/User');

// Get logged-in user's profile (with emergency contacts)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add an emergency contact
exports.addContact = async (req, res) => {
  try {
    const { name, phone, relation } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $push: { emergencyContacts: { name, phone, relation } } },
      { new: true }
    ).select('-password');

    res.status(201).json({ message: 'Contact added', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete an emergency contact
exports.deleteContact = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $pull: { emergencyContacts: { _id: req.params.contactId } } },
      { new: true }
    ).select('-password');

    res.json({ message: 'Contact removed', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Update safety profile
exports.updateSafetyProfile = async (req, res) => {
  try {
    const { bloodGroup, address, medicalNotes, age, photoUrl } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        safetyProfile: { bloodGroup, address, medicalNotes, age, photoUrl }
      },
      { new: true }
    ).select('-password');

    res.json({ message: 'Safety profile updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Get all unverified volunteers (admin only)
exports.getPendingVolunteers = async (req, res) => {
  try {
    const volunteers = await User.find({ role: 'volunteer', isVerified: false }).select('-password');
    res.json({ volunteers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify a volunteer (admin only)
exports.verifyVolunteer = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).select('-password');

    res.json({ message: 'Volunteer verified', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete/ban a user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};