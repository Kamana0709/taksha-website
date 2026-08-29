const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');

async function main() {
  // Find an intern
  let intern = await prisma.user.findFirst({ where: { role: 'INTERN' } });
  
  // If none exists, create one
  if (!intern) {
    intern = await prisma.user.create({
      data: {
        email: 'testintern@example.com',
        name: 'Test Intern',
        role: 'INTERN',
        track: 'Frontend Developer',
      }
    });
  }

  // Find a project to link to submissions
  let project = await prisma.project.findFirst();
  if (!project) {
    project = await prisma.project.create({
      data: { name: 'Test Project', description: 'Testing projectsCompleted' }
    });
  }

  // Create an approved submission for the intern
  await prisma.submission.create({
    data: {
      internId: intern.id,
      projectId: project.id,
      githubUrl: 'https://github.com/test/project',
      liveUrl: 'https://test-project.com',
      status: 'Approved',
      reviewedAt: new Date()
    }
  });

  // Call the logic to create a certificate
  const approvedSubmissions = await prisma.submission.findMany({
    where: { 
      internId: intern.id,
      status: { in: ['Approved', 'Auto-Submitted'] }
    },
    include: { project: true }
  });
  
  const projectsCompleted = approvedSubmissions.map(sub => ({
    projectName: sub.project?.name || 'Unknown Project',
    githubUrl: sub.githubUrl,
    liveUrl: sub.liveUrl,
    completedAt: sub.reviewedAt || sub.updatedAt
  }));

  const year = new Date().getFullYear();
  const count = await prisma.certificate.count({
    where: { certificateNumber: { startsWith: `TK/IC/${year}/` } }
  });
  const seq = String(count + 1).padStart(4, '0');
  const certificateNumber = `TK/IC/${year}/${seq}`;
  
  const certId = crypto.randomUUID();
  const newCert = await prisma.certificate.create({
    data: {
      id: certId,
      certificateNumber,
      role: intern.track || 'Frontend Developer',
      startDate: new Date().toLocaleDateString(),
      endDate: new Date().toLocaleDateString(),
      projectsCompleted,
      internId: intern.id
    }
  });

  console.log('Generated Certificate:', newCert.certificateNumber);
}

main().catch(console.error).finally(() => prisma.$disconnect());
