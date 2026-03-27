const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { prisma } = require('./lib/prisma');

dotenv.config();

const app = express();

app.set('trust proxy', 1);


// Middleware
app.use(cors({ origin: '*' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting & security
const { authLimiter, apiLimiter } = require('./middleware/rateLimit');
const helmet = require('helmet');
const morgan = require('morgan');

app.use(helmet());
app.use(morgan('combined'));
app.use(express.static('public'));
app.use('/api/auth', authLimiter);
app.use('/api/complaints', apiLimiter);

// Health check
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'OK', db: 'connected', timestamp: new Date() });
  } catch (error) {
    res.status(500).json({ status: 'DB Error', timestamp: new Date() });
  }
});

// Cloud-native healthz
app.get('/healthz', (req, res) => res.json({ status: 'healthy' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/complaints', require('./routes/complaints'));

console.log('Production backend ready!');

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set!');
    process.exit(1);
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET not set!');
    process.exit(1);
  }

  await prisma.$connect();
  console.log('✅ Prisma connected to database');
}

const cleanupUploads = require('./utils/cleanup');

// Graceful cleanup on shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, cleaning up');
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, async () => {
  await main();
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  cleanupUploads(); // Initial cleanup
});


