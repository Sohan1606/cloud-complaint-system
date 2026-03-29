const express = require('express');
const multer = require('multer');
const { prisma } = require('../lib/prisma');
const { createComplaint, getComplaints, getStats, getUserComplaints } = require('../controllers/complaintController');
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
router.get('/stats', getStats);

// 🔥 YOUR WORKING PUT /:id (generic update)
router.put('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo, priority } = req.body;
    
    console.log(`🔥 UPDATE ${id}:`, { status, assignedTo, priority });
    
    const complaint = await prisma.complaint.update({
      where: { id },
      data: {
        status,
        assignedTo: assignedTo || undefined,
        priority: priority || undefined,
        updatedAt: new Date()
      }
    });
    
    res.json({
      success: true,
      data: complaint
    });
  } catch (error) {
    console.error('PUT ERROR:', error.message);
    res.status(404).json({ message: 'Complaint not found' });
  }
});

// Legacy status route (keep for compatibility)
router.put('/:id/status', authorize('admin'), updateStatus);

module.exports = router;