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

app.get('/', (req, res) => {
  res.send('Cloud Complaint System API is running 🚀');
});

// Cloud-native healthz
app.get('/healthz', (req, res) => res.json({ status: 'healthy' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/stats', require('./routes/stats'));
app.use('/stats', require('./routes/stats'));

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

  // In main() function, after "✅ Prisma connected to database"
console.log('🌱 Running seed script...');
try {
  await require('./prisma/seed.js').main();
  console.log('✅ Seed complete');
} catch (seedError) {
  console.log('Seed skipped (data may already exist)');
}

  // 🌱 SEED CATEGORIES ON STARTUP (fixes foreign key error)
  console.log('🌱 Seeding default categories...');
  try {
    await prisma.category.upsert({
      where: { name: 'General' },
      update: {},
      create: { name: 'General', color: '#3B82F6' }
    });
    await prisma.category.upsert({
      where: { name: 'Technical' },
      update: {},
      create: { name: 'Technical', color: '#10B981' }
    });
    await prisma.category.upsert({
      where: { name: 'Billing' },
      update: {},
      create: { name: 'Billing', color: '#F59E0B' }
    });
    console.log('✅ Default categories seeded');
  } catch (seedError) {
    console.log('Seed skipped (categories may already exist)');
  }

  // Seed admin user if needed
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: require('./utils/bcrypt').hashSync('admin123'), // adjust if using bcrypt
      role: 'admin'
    }
  });
  console.log('✅ Admin user ready (admin@example.com / admin123)');
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