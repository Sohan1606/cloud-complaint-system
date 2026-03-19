const fs = require('fs');
const { prisma } = require('../lib/prisma');

// Create complaint
exports.createComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.userId;

    let imageUrl = null;
    let imagePublicId = null;
    if (req.file) {
      // Optional Cloudinary - skip if no keys
      try {
        const cloudinary = require('../utils/cloudinary');
        const result = await cloudinary.uploader.upload(req.file.path);
        imagePublicId = result.public_id;
        imageUrl = result.secure_url;
        
        // Cleanup temp file
        fs.unlinkSync(req.file.path);
      } catch (cloudError) {
        console.log('Cloudinary skipped, using local path:', cloudError.message);
        imageUrl = `/uploads/${req.file.filename}`;
      }
    }

    const complaint = await prisma.complaint.create({
      data: {
        title,
        description,
        imageUrl,
        imagePublicId,
        userId
      },
      include: {
        user: {
          select: { email: true }
        }
      }
    });

    res.status(201).json(complaint);
  } catch (error) {
    console.error('Complaint creation error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all complaints
exports.getComplaints = async (req, res) => {
  try {
    let complaints;
    if (req.user.role === 'admin') {
      complaints = await prisma.complaint.findMany({
        include: {
          user: {
            select: { email: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      complaints = await prisma.complaint.findMany({
        where: { userId: req.user.userId },
        include: {
          user: {
            select: { email: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    }
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get stats
exports.getStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const total = await prisma.complaint.count({ where: { userId } });
    const pending = await prisma.complaint.count({ where: { userId, status: 'pending' } });
    const inProgress = await prisma.complaint.count({ where: { userId, status: 'in-progress' } });
    const resolved = await prisma.complaint.count({ where: { userId, status: 'resolved' } });

    res.json({ total, pending, inProgress, resolved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update complaint status (admin only)
exports.updateStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const { status } = req.body;
    const complaint = await prisma.complaint.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        user: {
          select: { email: true }
        }
      }
    });

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user complaints
exports.getUserComplaints = async (req, res) => {
  try {
    const complaints = await prisma.complaint.findMany({
      where: { userId: req.user.userId },
      include: {
        user: {
          select: { email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getStats,
  updateStatus,
  getUserComplaints
};

