const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getStats = async (req, res) => {
  try {
    let totalComplaints, pending, resolved, inProgress;
    
    if (req.user && req.user.role === 'admin') {
      // Admin: global stats
      console.log(`📊 Admin ${req.user.userId.slice(0,8)} - global stats`);
      totalComplaints = await prisma.complaint.count();
      
      pending = await prisma.complaint.count({
        where: { status: "PENDING" }
      });
      resolved = await prisma.complaint.count({
        where: { status: "RESOLVED" }
      });
      inProgress = await prisma.complaint.count({
        where: { status: "IN_PROGRESS" }
      });
    } else if (req.user) {
      // User: personal stats
      const userId = req.user.userId;
      console.log(`📊 User ${userId.slice(0,8)} - personal stats`);
      
      totalComplaints = await prisma.complaint.count({ where: { userId } });
      pending = await prisma.complaint.count({
        where: { userId, status: "PENDING" }
      });
      resolved = await prisma.complaint.count({
        where: { userId, status: "RESOLVED" }
      });
      inProgress = await prisma.complaint.count({
        where: { userId, status: "IN_PROGRESS" }
      });
    } else {
      // Guest: empty/default
      console.log('👤 Guest stats - empty');
      totalComplaints = pending = resolved = inProgress = 0;
    }

    res.json({
      total: totalComplaints,
      pending,
      resolved,
      inProgress
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: "Error fetching stats" });
  }
};
