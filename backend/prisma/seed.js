const { prisma } = require('../lib/prisma');
const bcrypt = require('bcryptjs');

async function main() {
  // Seed categories FIRST (fixes foreign key error)
  await prisma.category.upsert({
    where: { name: 'General' },
    update: {},
    create: {
      id: 'default-category-id',
      name: 'General',
      description: 'General complaints',
      color: '#3B82F6'
    }
  });

  await prisma.category.upsert({
    where: { name: 'Technical' },
    update: {},
    create: {
      name: 'Technical',
      description: 'Technical issues',
      color: '#10B981'
    }
  });

  await prisma.category.upsert({
    where: { name: 'Billing' },
    update: {},
    create: {
      name: 'Billing',
      description: 'Billing & payments',
      color: '#F59E0B'
    }
  });

  // Seed admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      id: 'admin-id-123',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    }
  });

  console.log('✅ Admin user and 3 categories seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });