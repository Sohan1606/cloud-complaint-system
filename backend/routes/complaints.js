const express = require('express');
const multer = require('multer');
const path = require('path');
const { prisma } = require('../lib/prisma');
const { protect, authorize } = require('../middleware/auth');
const {
  createComplaint,
  getComplaints,
  updateStatus,
  getUserComplaints,
  updateComplaint,
} = require('../controllers/complaintController');

const router = express.Router();


// ── Multer Setup ─────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

// ✅ File filter (ONLY images)
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });


// ── Logger ───────────────────────────────────────────────────────────────────
router.use((req, res, next) => {
  const uid = req.user?.id || req.user?.userId || 'guest';
  console.log(`➡️ ${req.method} ${req.originalUrl} | User: ${uid}`);
  next();
});


// ── PUBLIC DEBUG ─────────────────────────────────────────────────────────────
router.get('/debug', async (req, res) => {
  try {
    const complaints = await prisma.complaint.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        imageUrl: true, // ✅ FIXED
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            profilePic: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, complaints });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Server error', // ✅ STRING ONLY
    });
  }
});


// ── PROTECTED ROUTES ─────────────────────────────────────────────────────────
router.use(protect);


// ── CREATE (controller-based) ────────────────────────────────────────────────
router.post('/', upload.single('image'), createComplaint);


// ── GET ALL ──────────────────────────────────────────────────────────────────
router.get('/', getComplaints);


// ── GET USER COMPLAINTS ──────────────────────────────────────────────────────
router.get('/my-complaints', getUserComplaints);


// ── UPDATE STATUS ────────────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id?.trim()) {
      return res.status(400).json({ error: 'ID required' });
    }

    const valid = ['PENDING', 'IN_PROGRESS', 'RESOLVED'];
    if (!status || !valid.includes(status.toUpperCase())) {
      return res.status(400).json({
        error: 'Valid status required: PENDING | IN_PROGRESS | RESOLVED',
      });
    }

    const complaint = await prisma.complaint.update({
      where: { id: id.trim() },
      data: {
        status: status.toUpperCase(),
        updatedAt: new Date(),
      },
      include: {
        user: { select: { email: true, role: true, profilePic: true } },
      },
    });

    res.json({
      success: true,
      complaint,
      message: `Updated to ${status.toUpperCase()}`,
    });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    res.status(500).json({ error: err.message });
  }
});


// ── LEGACY STATUS ────────────────────────────────────────────────────────────
router.put('/:id/status', updateStatus);


// ── UPDATE ANY FIELD ─────────────────────────────────────────────────────────
router.patch('/:id', updateComplaint);


// ── DELETE (ADMIN ONLY) ──────────────────────────────────────────────────────
router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    await prisma.complaint.delete({
      where: { id: req.params.id },
    });

    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Not found' });
    }
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;