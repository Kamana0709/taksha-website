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
      mentorId: mentor.id,
    },
  });

  const intern2 = await prisma.user.create({
    data: {
      email: 'intern@taksha.in',
      name: 'Intern User',
      passwordHash: defaultPassword,
      role: 'INTERN',
      mentorId: mentor.id,
    },
  });

  const p1Tasks = [
    'Hero section', 'About section', 'Services section', 'Why Choose Us section',
    'Portfolio / gallery', 'Testimonials', 'Contact section', 'Responsive navbar',
    'Footer', 'Fully mobile-responsive layout'
  ];

  const p2Tasks = [
    'Internship cards', 'Search', 'Category filter', 'Location filter', 'Sort',
    'Internship details view', 'Application form with validation', 'Loading state',
    'Error state', 'Empty state'
  ];

  const p3Tasks = [
    'Overview panel', 'Revenue metrics', 'Users metrics', 'Orders metrics',
    'Conversion metrics', 'Growth metrics', 'Charts', 'Tables', 'Filters',
    'Date range selection', 'Search', 'Sorting', 'Responsive sidebar and navigation',
    'Loading, empty, and error states'
  ];

  for (const intern of [intern1, intern2]) {
    for (const title of p1Tasks) {
      await prisma.task.create({
        data: {
          title, projectId: project1.id, assigneeId: intern.id, assignerId: mentor.id,
          priority: 'Medium', status: 'TODO', date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
        }
      });
    }
    for (const title of p2Tasks) {
      await prisma.task.create({
        data: {
          title, projectId: project2.id, assigneeId: intern.id, assignerId: mentor.id,
          priority: 'Medium', status: 'TODO', date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
        }
      });
    }
    for (const title of p3Tasks) {
      await prisma.task.create({
        data: {
          title, projectId: project3.id, assigneeId: intern.id, assignerId: mentor.id,
          priority: 'Medium', status: 'TODO', date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
        }
      });
    }
  }

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
