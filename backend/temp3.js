const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.application.findMany({ orderBy: { createdAt: 'desc' }, take: 1 })
  .then(a => console.log(a[0].id))
  .finally(() => prisma.$disconnect());
