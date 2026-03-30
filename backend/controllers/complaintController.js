const fs = require('fs');
const { prisma } = require('../lib/prisma');

/* DISABLED - POST now inline in routes/complaints.js to avoid req.user crash
const createComplaint = async (req, res) => { ... }; */

// Get all complaints
const getComplaints = async (req, res) => {
  try {
    let complaints;

    // 🔥 GUEST SUPPORT: Recent complaints (like /debug but with relations)
    if (!req.user) {
      console.log('👤 Guest access - returning recent complaints');
      complaints = await prisma.complaint.findMany({
        include: {
          user: { select: { email: true, id: true } },
          category: true
        },
        orderBy: { createdAt: 'desc' },
        take: 10  // Limit for guests
      });
    } else if (req.user.role === 'admin') {
      console.log('👑 Admin - all complaints');
      complaints = await prisma.complaint.findMany({
        include: {
          user: true,
          category: true
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      console.log(`🔐 User ${req.user.userId} - own complaints`);
      complaints = await prisma.complaint.findMany({
        where: { userId: req.user.userId },
        include: {
          user: true,
          category: true
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    console.log(`📋 Returning ${complaints.length} complaints`);
    res.json(complaints);
  } catch (error) {
    console.error('getComplaints error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get stats
const getStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const total = await prisma.complaint.count({ where: { userId } });
    const pending = await prisma.complaint.count({
      where: { userId, status: 'pending' }
    });
    const inProgress = await prisma.complaint.count({
      where: { userId, status: 'in-progress' }
    });
    const resolved = await prisma.complaint.count({
      where: { userId, status: 'resolved' }
    });

    res.json({ total, pending, inProgress, resolved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update complaint status (admin only)
const updateStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { status } = req.body;

    const complaint = await prisma.complaint.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        user: true
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
const getUserComplaints = async (req, res) => {
  try {
    const complaints = await prisma.complaint.findMany({
      where: { userId: req.user.userId },
      include: {
        user: true,
        category: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateComplaint = async (req, res) => {
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
};

module.exports = {
  // createComplaint disabled - inline in routes
  getComplaints,
  getStats,
  updateStatus,
  getUserComplaints,
  updateComplaint
};
