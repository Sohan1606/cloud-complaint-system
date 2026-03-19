const express = require('express');
const multer = require('multer');
// Cloudinary handled in controller
const { createComplaint, getComplaints, updateStatus, getUserComplaints } = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Protect all routes
router.use(protect);

// Create complaint
router.post('/', upload.single('image'), createComplaint);

// Get user complaints
router.get('/my-complaints', getUserComplaints);

// Get all complaints (admin & user dashboard)
router.get('/', getComplaints);
router.get('/stats', (req, res) => {
  res.json({ total: 0, pending: 0, resolved: 0 });
});


// Update status (admin only)
router.put('/:id/status', authorize('admin'), updateStatus);

module.exports = router;

