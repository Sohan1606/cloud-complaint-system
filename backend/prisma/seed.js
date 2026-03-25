const { prisma } = require('../lib/prisma');
const bcrypt = require('bcryptjs');

async function main() {
  // Seed admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    }
  });

  // Seed categories
  const categories = [
    { name: 'Infrastructure', color: '#EF4444' },
    { name: 'Service', color: '#3B82F6' },
    { name: 'Billing', color: '#10B981' },
    { name: 'Technical', color: '#F59E0B' }
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat
    });
  }

  console.log('Admin user and categories seeded');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());

