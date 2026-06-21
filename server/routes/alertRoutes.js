const express = require('express');
const router = express.Router();
const { protect, volunteerOnly, adminOnly } = require('../middleware/authMiddleware');
const {
  createAlert,
  getActiveAlerts,
  acceptAlert,
  resolveAlert,
  getMyAlerts,
  getAllAlertsAdmin
} = require('../controllers/alertController');

router.post('/sos', protect, createAlert);
router.get('/active', protect, volunteerOnly, getActiveAlerts);
router.put('/:id/accept', protect, volunteerOnly, acceptAlert);
router.put('/:id/resolve', protect, resolveAlert);
router.get('/my-alerts', protect, getMyAlerts);
router.get('/admin/all', protect, adminOnly, getAllAlertsAdmin);

module.exports = router;