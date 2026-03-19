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

  console.log('Admin user created: admin@example.com / admin123');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());

