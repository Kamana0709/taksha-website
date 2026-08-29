const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { PROJECT_TEMPLATES } = require('./projectTemplates');

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  await prisma.submission.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding projects...');
  const projectMap = {};
  for (const template of PROJECT_TEMPLATES) {
    const project = await prisma.project.create({
      data: { name: template.name, description: template.description }
    });
    projectMap[template.key] = project;
  }

  console.log('Seeding users...');
  const defaultPassword = await bcrypt.hash('password123', 10);
  const charuPassword = await bcrypt.hash('Taksha Nexus@2606', 10);

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

  for (const intern of [intern1, intern2]) {
    for (const template of PROJECT_TEMPLATES) {
      const project = projectMap[template.key];

      const now = new Date();
      await prisma.projectAssignment.create({
        data: {
          projectId: project.id,
          internId: intern.id,
          assignedAt: now,
          deadlineDays: 7,
          deadlineAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        }
      });

      for (const checklistItem of template.checklist) {
        await prisma.task.create({
          data: {
            title: checklistItem.title,
            skillTags: checklistItem.skills || [],
            projectId: project.id,
            assigneeId: intern.id,
            assignerId: mentor.id,
            priority: 'Medium',
            status: 'TODO',
            date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
          }
        });
      }
    }
  }

  console.log('Seeding complete! You can log in with:');
  console.log('Mentor: mentor@taksha.in / password123');
  console.log('Intern 1: charumandilwar@gmail.com / Taksha Nexus@2606');
  console.log('Intern 2: rishikat1321@gmail.com / Taksha Nexus@2601');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
