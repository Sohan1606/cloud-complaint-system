const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getStats = async (req, res) => {
  try {
    const totalComplaints = await prisma.complaint.count();

    const pending = await prisma.complaint.count({
      where: { status: "pending" }
    });

    const resolved = await prisma.complaint.count({
      where: { status: "resolved" }
    });

    const inProgress = await prisma.complaint.count({
      where: { status: "in-progress" }
    });

    res.json({
      total: totalComplaints,
      pending,
      resolved,
      inProgress
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching stats" });
  }
};