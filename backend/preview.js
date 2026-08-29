const generateCertificateHtml = require('./certificateTemplate');
const fs = require('fs');
const path = require('path');

const html = generateCertificateHtml({
  name: "Charu Mandilwar",
  role: 'Frontend Developer',
  startDate: '20th May 2025',
  endDate: '20th June 2025',
  certificateId: 'TK/IC/2026/0001'
});

const artifactPath = path.join('C:\\Users\\kaman\\.gemini\\antigravity-ide\\brain\\2835f789-587f-4f6f-a741-445d8f8b3393', 'certificate_preview2.html');
fs.writeFileSync(artifactPath, html);
console.log('Saved preview to', artifactPath);
