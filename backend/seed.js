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
    data: { name: 'Project 1: Business Landing Page', description: 'UI / Frontend Fundamentals — Turn a real business brief into a polished, responsive website.' }
  });
  const project2 = await prisma.project.create({
    data: { name: 'Project 2: Internship Discovery Platform', description: 'JavaScript + API — Build a React app that consumes real (or mock) API data.' }
  });
  const project3 = await prisma.project.create({
    data: { name: 'Project 3: Business Analytics Dashboard', description: 'Real-World Product Case Study — Turn an ambiguous business problem into a usable, decision-ready dashboard.' }
  });

  console.log('Seeding users...');
  const defaultPassword = await bcrypt.hash('password123', 10);
  const charuPassword = await bcrypt.hash('Taksha@2606', 10);

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
      email: 'charumandilwar@gmail.com',
      name: 'Charu Mandilwar',
      passwordHash: charuPassword,
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

  // Create tasks for Charu in Project 1
  await prisma.task.create({
    data: {
      title: 'Hero & About Sections',
      projectId: project1.id,
      priority: 'High',
      status: 'TODO',
      date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      assigneeId: intern1.id,
      assignerId: mentor.id,
    }
  });

  await prisma.task.create({
    data: {
      title: 'Services & Portfolio Sections',
      projectId: project1.id,
      priority: 'Medium',
      status: 'TODO',
      date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      assigneeId: intern1.id,
      assignerId: mentor.id,
    }
  });

  // Create tasks for Charu in Project 2
  await prisma.task.create({
    data: {
      title: 'Internship Listing & API Integration',
      projectId: project2.id,
      priority: 'High',
      status: 'TODO',
      date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      assigneeId: intern1.id,
      assignerId: mentor.id,
    }
  });

  // Create tasks for Charu in Project 3
  await prisma.task.create({
    data: {
      title: 'Analytics Dashboard Layout & Routing',
      projectId: project3.id,
      priority: 'High',
      status: 'TODO',
      date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      assigneeId: intern1.id,
      assignerId: mentor.id,
    }
  });

  console.log('Seeding complete! You can log in with:');
  console.log('Mentor: mentor@taksha.in / password123');
  console.log('Intern 1: charumandilwar@gmail.com / Taksha@2606');
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
