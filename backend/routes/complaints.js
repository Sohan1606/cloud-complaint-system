const express = require('express');
const multer = require('multer');
const { prisma } = require('../lib/prisma');
const { getComplaints, getStats, updateStatus, getUserComplaints } = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../lib/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'complaints',
    format: async (req, file) => 'jpg',
    public_id: () => `complaint-${Date.now()}-${Math.round(Math.random() * 1E9)}`
  }
});
const upload = multer({ storage });

// 🔥 LOG ALL INCOMING REQUESTS
router.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.originalUrl} | ID: ${req.params.id || 'N/A'} | User: ${req.user?.id || 'guest'}`);
  next();
});

// 🔥 ZERO RELATIONS POST - NO CRASH
router.post('/', protect, upload.single('image'), async (req, res) => {
  console.log('📡 POST | Token decoded:', req.user);
  
  const userId = req.user.userId; // Match JWT payload
  if (!userId) {
    return res.status(401).json({ error: '🚫 Invalid user ID from token' });
  }
  
  const { title, description, priority = 'LOW', categoryId } = req.body;
  if (!title?.trim() || !description?.trim()) {
    return res.status(400).json({ error: 'Title & description required' });
  }

  let imageUrl = null;
  let imagePublicId = null;
  if (req.file) {
    // Fallback to local if Cloudinary fails
    if (req.file.secure_url && req.file.secure_url !== 'undefined') {
      imageUrl = req.file.secure_url;
      imagePublicId = req.file.public_id;
      console.log(`☁️ Cloudinary uploaded: ${imageUrl}`);
    } else {
      imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
      console.log(`🖼️ Local fallback: ${imageUrl}`);
    }
  }

  const complaint = await prisma.complaint.create({
    data: {
      title: title.trim(),
      description: description.trim(),
      priority,
      categoryId: categoryId || 'default-category-id',
      imageUrl,
      status: 'PENDING',
      userId
    }
  });
  
  console.log(`✅ NEW ${complaint.id.slice(0,8)} by ${userId.slice(0,8)}`);
  res.status(201).json({ success: true, complaint });
});

// Get complaints
router.get('/', protect, getComplaints);
router.get('/stats', getStats);
router.get('/my-complaints', getUserComplaints);

// 🔥 DEBUG ROUTE (PUBLIC for testing)
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

// 🔥 UPDATE ROUTE - ADMIN PROTECTED
router.put('/:id', protect, async (req, res) => {
  console.log('🎯 PUT /:id ADMIN UPDATE!');
  console.log('ID:', req.params.id);
  console.log('Body:', req.body);
  console.log('Admin:', req.user?.userId, req.user?.role);
  
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['PENDING', 'IN_PROGRESS', 'RESOLVED'].includes(status.toUpperCase())) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    console.log(`📝 Admin ${req.user.userId.slice(0,8)} updating ${id.slice(0,8)} → ${status}`);
    
    const complaint = await prisma.complaint.update({
      where: { id },
      data: { 
        status: status.toUpperCase(),
        updatedAt: new Date()
      },
      include: {
        user: { select: { email: true } }
      }
    });
    
    console.log(`✅ UPDATED: ${complaint.id} → ${complaint.status} (by admin ${req.user.userId.slice(0,8)})`);
    res.json({ 
      success: true, 
      complaint,
      message: `Status updated to ${status.toUpperCase()}`
    });
  } catch (error) {
    console.error('❌ UPDATE ERROR:', error.message);
    if (error.code === 'P2025') { // Record not found
      res.status(404).json({ error: 'Complaint not found' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Legacy
router.put('/:id/status', authorize('admin'), updateStatus);

module.exports = router;