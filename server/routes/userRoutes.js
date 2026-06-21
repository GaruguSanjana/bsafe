const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getProfile,
  addContact,
  deleteContact,
  updateSafetyProfile,
  getPendingVolunteers,
  verifyVolunteer,
  getAllUsers,
  deleteUser
} = require('../controllers/userController');

router.get('/profile', protect, getProfile);
router.post('/contacts', protect, addContact);
router.delete('/contacts/:contactId', protect, deleteContact);
router.put('/profile', protect, updateSafetyProfile);
router.get('/pending-volunteers', protect, adminOnly, getPendingVolunteers);
router.put('/verify/:id', protect, adminOnly, verifyVolunteer);
router.get('/all', protect, adminOnly, getAllUsers);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;