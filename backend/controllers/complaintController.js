const { prisma } = require('../lib/prisma');

// ── CREATE COMPLAINT ─────────────────────────────────────────────────────────
const createComplaint = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    let { title, description, categoryId } = req.body;

    if (!title || !description || !categoryId) {
      return res.status(400).json({
        message: 'Title, description and categoryId are required'
      });
    }

    // Ensure category exists (prevents FK constraint violation).
    // Frontend currently sends a placeholder "default-category-id" so we auto-provision it.
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });

    if (!existingCategory) {
      if (categoryId === 'default-category-id') {
        // If "General" already exists (name is unique), reuse it.
        const existingGeneral = await prisma.category.findUnique({
          where: { name: 'General' },
          select: { id: true },
        });

        if (existingGeneral?.id) {
          categoryId = existingGeneral.id;
        } else {
          // Otherwise, create a category with a deterministic id.
          await prisma.category.create({
            data: {
              id: 'default-category-id',
              name: 'General',
              description: 'Default category (auto-created)',
            },
          });
        }
      } else {
        return res.status(400).json({
          message: 'Invalid categoryId',
        });
      }
    }

    // ✅ FIXED IMAGE FIELD
    let imageUrl = null;
    if (req.file) {
      imageUrl = 'uploads/' + req.file.filename;
    }

    const complaint = await prisma.complaint.create({
      data: {
        title,
        description,
        categoryId,
        imageUrl: imageUrl, // ✅ FIXED (VERY IMPORTANT)
        status: 'PENDING',
        userId,
      },
      include: {
        user: { select: { id: true, email: true, role: true, profilePic: true } },
      },
    });

    res.status(201).json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error('createComplaint error:', error);
    res.status(500).json({
      message: error.message || 'Server error' // ✅ ALWAYS STRING
    });
  }
};

// ── GET ALL COMPLAINTS ────────────────────────────────────────────────────────
const getComplaints = async (req, res) => {
  try {
    let complaints;

    if (!req.user) {
      complaints = await prisma.complaint.findMany({
        include: { user: { select: { email: true, id: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });
    } else {
      const userId = req.user.id || req.user.userId;
      const role = (req.user.role || '').toLowerCase();

      if (role === 'admin') {
        complaints = await prisma.complaint.findMany({
          include: {
            user: { select: { id: true, email: true, role: true, profilePic: true } }
          },
          orderBy: { createdAt: 'desc' },
        });
      } else {
        complaints = await prisma.complaint.findMany({
          where: { userId },
          include: {
            user: { select: { id: true, email: true, role: true, profilePic: true } }
          },
          orderBy: { createdAt: 'desc' },
        });
      }
    }

    res.json(complaints);
  } catch (error) {
    console.error('getComplaints error:', error);
    res.status(500).json({
      message: error.message || 'Server error'
    });
  }
};

// ── GET STATS ─────────────────────────────────────────────────────────────────
const getStats = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    const role = (req.user?.role || '').toLowerCase();

    const where = role === 'admin' ? {} : { userId };

    const [total, pending, inProgress, resolved, users] = await Promise.all([
      prisma.complaint.count({ where }),
      prisma.complaint.count({ where: { ...where, status: 'PENDING' } }),
      prisma.complaint.count({ where: { ...where, status: 'IN_PROGRESS' } }),
      prisma.complaint.count({ where: { ...where, status: 'RESOLVED' } }),
      prisma.user.count().catch(() => 0),
    ]);

    res.json({
      total,
      pending,
      inProgress,
      resolved,
      users,
    });
  } catch (error) {
    console.error('getStats error:', error);
    res.status(500).json({
      message: error.message || 'Server error'
    });
  }
};

// ── UPDATE STATUS ─────────────────────────────────────────────────────────────
const updateStatus = async (req, res) => {
  try {
    const role = (req.user?.role || '').toLowerCase();
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const complaint = await prisma.complaint.update({
      where: { id: req.params.id },
      data: {
        status: status.toUpperCase(),
        updatedAt: new Date(),
      },
      include: {
        user: { select: { id: true, email: true, role: true, profilePic: true } },
      },
    });

    res.json(complaint);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.status(500).json({
      message: error.message || 'Server error'
    });
  }
};

// ── GET USER COMPLAINTS ──────────────────────────────────────────────────────
const getUserComplaints = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId;

    const complaints = await prisma.complaint.findMany({
      where: { userId },
      include: {
        user: { select: { id: true, email: true, role: true, profilePic: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Server error'
    });
  }
};

// ── UPDATE COMPLAINT ─────────────────────────────────────────────────────────
const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await prisma.complaint.update({
      where: { id },
      data: { ...req.body, updatedAt: new Date() },
    });

    res.json(complaint);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.status(500).json({
      message: error.message || 'Server error'
    });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getStats,
  updateStatus,
  getUserComplaints,
  updateComplaint,
};