const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up dummy data...');

  // Delete all tasks
  const deletedTasks = await prisma.task.deleteMany({});
  console.log(`Deleted ${deletedTasks.count} tasks.`);

  // Delete all announcements
  const deletedAnnouncements = await prisma.announcement.deleteMany({});
  console.log(`Deleted ${deletedAnnouncements.count} announcements.`);

  // Delete all interns
  const deletedInterns = await prisma.user.deleteMany({
    where: {
      role: 'INTERN'
    }
  });
  console.log(`Deleted ${deletedInterns.count} interns.`);

  console.log('Database is now clean! Only the Mentor account remains.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
