const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── SECURITY & PARSING ────────────────────────────────────────────────────────
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Allow both local dev and your deployed Vercel URL
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL, // e.g. https://cloud-complaint-system.vercel.app
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, mobile)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── LOGGING ───────────────────────────────────────────────────────────────────
app.use(morgan('dev'));

// ─── STATIC FILE SERVING (FIX /uploads 404) ───────────────────────────────────
// Serves uploaded images at http://localhost:5000/uploads/<filename>
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── RATE LIMITING (applied AFTER static, BEFORE API routes) ──────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', apiLimiter);

// ─── API ROUTES ────────────────────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/stats',      require('./routes/stats'));

// ─── HEALTH CHECK ──────────────────────────────────────────────────────────────
app.get('/health', async (req, res) => {
  try {
    const { prisma } = require('./lib/prisma');
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'OK',
      db: 'connected',
      uptime: Math.floor(process.uptime()) + 's',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', db: 'disconnected', error: err.message });
  }
});

app.get('/healthz', (req, res) => res.json({ status: 'healthy' }));

// ─── 404 HANDLER ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

// ─── GLOBAL ERROR HANDLER ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err.message);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// ─── START SERVER ──────────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 Health: http://localhost:${PORT}/health`);
  console.log(`🔍 Debug:  http://localhost:${PORT}/api/complaints/debug`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  server.close(() => process.exit(0));
});

module.exports = app;