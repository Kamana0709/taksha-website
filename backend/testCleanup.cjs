const { generateCertificatePdf } = require('./generateCertificatePdf');

async function main() {
  const destPath = './uploads/test.pdf';
  try {
    await generateCertificatePdf({
      name: "O'Brien & Sons_Test",
      role: 'Test Role',
      startDate: '10/10/2026',
      endDate: '10/11/2026',
      certificateId: 'TK/IC/TEST/001'
    }, destPath);
  } catch (error) {
    console.log('Expected error caught:', error.message);
  }
}

main();
