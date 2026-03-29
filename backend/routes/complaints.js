const express = require('express');
const multer = require('multer');
const { prisma } = require('../lib/prisma');
const { createComplaint, getComplaints, getStats, updateStatus, getUserComplaints } = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// 🔥 LOG ALL INCOMING REQUESTS
router.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.originalUrl} | ID: ${req.params.id || 'N/A'} | User: ${req.user?.id || 'guest'}`);
  next();
});

// 🔥 PUBLIC DEBUG (before protect)
router.get('/debug', async (req, res) => {
  try {
    const complaints = await prisma.complaint.findMany({
      select: { id: true, title: true, status: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    console.log(`🔍 DEBUG: ${complaints.length} complaints found`);
    res.json({
      success: true,
      count: complaints.length,
      validIds: complaints.map(c => c.id),
      recent: complaints.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔥 PROTECTED ROUTES (after debug)
router.use(protect);

router.post('/', upload.single('image'), createComplaint);
router.get('/', getComplaints);
router.get('/stats', getStats);
router.get('/my-complaints', getUserComplaints);

// 🔥 UPDATE ROUTE - WITH FULL LOGS
router.put('/:id', async (req, res) => {
  console.log('🎯 PUT /:id ROUTE HIT!');
  console.log('ID:', req.params.id);
  console.log('Body:', req.body);
  console.log('User:', req.user?.id);
  
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log(`📝 Updating ${id.slice(0,8)}... to "${status}"`);
    
    const complaint = await prisma.complaint.update({
      where: { id },
      data: { status: status.toUpperCase() }
    });
    
    console.log(`✅ UPDATED: ${complaint.id} → ${complaint.status}`);
    res.json({ 
      success: true, 
      complaint,
      message: `Status updated to ${status.toUpperCase()}`
    });
  } catch (error) {
    console.error('❌ PRISMA ERROR:', error.message);
    res.status(404).json({ error: 'Complaint not found' });
  }
});

// Legacy
router.put('/:id/status', authorize('admin'), updateStatus);

module.exports = router;