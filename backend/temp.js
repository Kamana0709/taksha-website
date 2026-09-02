const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.application.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }).then(a => console.log(a.map(x => ({ name: x.name, email: x.email, offerStatus: x.offerStatus })))).finally(() => prisma.$disconnect());
