const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function addSuperAdmin() {
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@taksha.in' },
    update: { role: 'SUPER_ADMIN' },
    create: {
      id: 'TN-ADMIN-001',
      email: 'admin@taksha.in',
      name: 'Taksha Super Admin',
      passwordHash,
      role: 'SUPER_ADMIN',
      mustChangePassword: false,
      status: 'Active'
    }
  });
  console.log('Super Admin created!');
}

addSuperAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
