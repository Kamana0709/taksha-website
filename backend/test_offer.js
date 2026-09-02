const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const takshaHR = require('./takshaHR');
const { uploadFile, getSignedUrl } = require('./storage');
const fs = require('fs');

async function testGenerate() {
  const application = await prisma.application.findUnique({
    where: { id: 'e9d92dbc-a205-488f-b960-978d32a7942f' }
  });
  
  console.log('Generating PDF...');
  const localPdfPath = await takshaHR.generateOfferPDF(application);
  console.log('Generated PDF at', localPdfPath);
  
  console.log('Uploading to Supabase...');
  const fileBuffer = fs.readFileSync(localPdfPath);
  const objectPath = `offer_${application.id}.pdf`;
  
  await uploadFile('submissions', objectPath, fileBuffer, 'application/pdf');
  const offerUrl = await getSignedUrl('submissions', objectPath, 315360000); // 10 years valid
  
  console.log('Supabase URL:', offerUrl);
  await prisma.$disconnect();
}

testGenerate().catch(err => {
  console.error('ERROR:', err);
  prisma.$disconnect();
});
