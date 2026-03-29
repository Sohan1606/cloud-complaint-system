const express = require('express');
const multer = require('multer');
const { prisma } = require('../lib/prisma');
const { createComplaint, getComplaints, getStats, updateStatus, getUserComplaints } = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.use(protect);

// Create complaint
router.post('/', upload.single('image'), createComplaint);

// Get user complaints
router.get('/my-complaints', getUserComplaints);

// Get all complaints (admin & user dashboard)
router.get('/', getComplaints);
router.get('/stats', getStats);

// Generic update PUT /:id
router.put('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const complaint = await prisma.complaint.update({
      where: { id },
      data: updates
    });
    
    res.json(complaint);
  } catch (error) {
    res.status(404).json({ message: 'Complaint not found' });
  }
});

// Legacy admin status update
router.put('/:id/status', authorize('admin'), updateStatus);

module.exports = router;
