

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log('USERS:');
  console.log(users.map(u => ({ id: u.id, name: u.name, role: u.role, track: u.track })));

  const tasks = await prisma.task.findMany();
  console.log('TASKS:');
  console.log(tasks.map(t => ({ id: t.id, title: t.title, assigneeId: t.assigneeId, projectId: t.projectId })));
}

main().finally(() => prisma.$disconnect());
