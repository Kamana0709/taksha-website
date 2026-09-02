const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.application.updateMany({ data: { offerUrl: null, offerStatus: null } })
  .then(() => console.log('Cleared old offers'))
  .finally(() => prisma.$disconnect());
