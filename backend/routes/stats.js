const express = require('express');
const router = express.Router();
const { prisma } = require('../lib/prisma');

router.get('/', async (req, res) => {
  try {
    const total = await prisma.complaint.count();
    const pending = await prisma.complaint.count({
      where: { status: 'pending' }
    });
    const resolved = await prisma.complaint.count({
      where: { status: 'resolved' }
    });

    res.json({
      total,
      pending,
      resolved
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

module.exports = router;