const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getSafeZones, createSafeZone } = require('../controllers/safeZoneController');

router.get('/', protect, getSafeZones);
router.post('/', protect, createSafeZone);

module.exports = router;