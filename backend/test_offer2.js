require('dotenv').config();
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
  
  try {
    await uploadFile('submissions', objectPath, fileBuffer, 'application/pdf');
    console.log('Upload success. Getting signed URL...');
    const offerUrl = await getSignedUrl('submissions', objectPath, 315360000); // 10 years valid
    console.log('Supabase URL:', offerUrl);
  } catch (err) {
    console.error('Supabase error:', err);
  }
  await prisma.$disconnect();
}

testGenerate().catch(err => {
  console.error('ERROR:', err);
  prisma.$disconnect();
});
