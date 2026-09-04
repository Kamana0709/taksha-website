const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const apps = await prisma.application.findMany({ where: { offerStatus: 'Sent' } });
  if (apps.length === 0) {
    console.log('No apps');
    return;
  }
  const res = await fetch('http://localhost:5000/api/applications/' + apps[0].id + '/offer-response', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'accept' })
  });
  console.log(await res.json());
}
run().catch(console.error).finally(() => prisma.$disconnect());
