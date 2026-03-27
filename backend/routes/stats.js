app.use('/api/stats', require('./routes/stats'));
const express = require('express');
const router = express.Router();
const { prisma } = require('../lib/prisma');

router.get('/', async (req, res) => {
  try {
    const totalComplaints = await prisma.complaint.count();
    const pending = await prisma.complaint.count({
      where: { status: 'pending' }
    });
    const resolved = await prisma.complaint.count({
      where: { status: 'resolved' }
    });

    res.json({
      total: totalComplaints,
      pending,
      resolved
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

module.exports = router;