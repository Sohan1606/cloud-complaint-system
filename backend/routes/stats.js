const express = require('express');
const { protect } = require('../middleware/auth');
const { getStats } = require('../controllers/statsController');

const router = express.Router();

// Protect all stats routes
router.use(protect);

// GET /api/stats - User-specific stats (protected)
router.get('/', getStats);

module.exports = router;
