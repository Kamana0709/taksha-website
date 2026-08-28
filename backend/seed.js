const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  await prisma.submission.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding projects...');
  const project1 = await prisma.project.create({
    data: { name: 'Finora Project', description: 'Banking application frontend.' }
  });
  const project2 = await prisma.project.create({
    data: { name: 'NovaCare App', description: 'Healthcare appointment system.' }
  });

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

  const intern1 = await prisma.user.create({
    data: {
      email: 'charu@taksha.in',
      name: 'Charu Mandilwar',
      passwordHash: defaultPassword,
      role: 'INTERN',
    },
  });

  const intern2 = await prisma.user.create({
    data: {
      email: 'intern@taksha.in',
      name: 'Intern User',
      passwordHash: defaultPassword,
      role: 'INTERN',
    },
  });

  // Create a task for Charu in project1
  await prisma.task.create({
    data: {
      title: 'Initial Setup & Onboarding',
      projectId: project1.id,
      priority: 'High',
      status: 'TODO',
      date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      assigneeId: intern1.id,
      assignerId: mentor.id,
    }
  });

  console.log('Seeding complete! You can log in with:');
  console.log('Mentor: mentor@taksha.in / password123');
  console.log('Intern 1: charu@taksha.in / password123');
  console.log('Intern 2: intern@taksha.in / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
