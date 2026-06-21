const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};

const volunteerOnly = async (req, res, next) => {
  if (req.user.role !== 'volunteer' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Volunteer access only' });
  }

  if (req.user.role === 'volunteer') {
    const User = require('../models/User');
    const user = await User.findById(req.user.userId);
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Your volunteer account is pending verification' });
    }
  }

  next();
};

module.exports = { protect, adminOnly, volunteerOnly };