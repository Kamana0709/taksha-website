const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  await prisma.announcement.deleteMany();
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding users...');
  const defaultPassword = await bcrypt.hash('password123', 10);

  const mentor = await prisma.user.create({
    data: {
      email: 'mentor@taksha.in',
      name: 'Mentor Kamana',
      passwordHash: defaultPassword,
      role: 'MENTOR',
    },
  });

  console.log('Seeding complete! You can log in with:');
  console.log('Mentor: mentor@taksha.in / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
