const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');

// Email Transporter (Configured for Gmail as requested)
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'takshadigital@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'dummy_password', // Should be App Password
    },
  });
};

const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: '"Taksha HR — Taksha Nexus" <takshadigital@gmail.com>',
      to,
      subject,
      html,
      attachments,
    });
    return { success: true };
  } catch (error) {
    console.error("Email delivery failed:", error);
    return { success: false, error };
  }
};

const evaluateApplication = async (appId) => {
  const application = await prisma.application.findUnique({ where: { id: appId } });
  if (!application) return;

  // Simple heuristic AI simulation based on requested output
  let score = 50;
  const strengths = [];
  const weaknesses = [];
  const missingSkills = [];

  const role = (application.roleTitle || '').toLowerCase();
  const skills = (application.skills || '').toLowerCase();
  const exp = parseInt(application.experience || '0', 10);

  if (application.hasProjects) {
    score += 15;
    strengths.push("Good portfolio and relevant projects");
  } else {
    weaknesses.push("No visible projects");
  }

  if (exp > 0) {
    score += 10 + (exp * 5);
    strengths.push(`${exp} years of prior experience`);
  } else {
    weaknesses.push("Limited professional experience");
  }

  // Role specific checks
  if (role.includes('frontend')) {
    if (skills.includes('react') || skills.includes('javascript') || skills.includes('html')) {
      score += 20;
      strengths.push("Strong frontend stack knowledge");
    } else {
      missingSkills.push("React, JavaScript");
    }
  } else if (role.includes('full-stack') || role.includes('full stack')) {
    if (skills.includes('node') || skills.includes('express') || skills.includes('backend')) {
      score += 10;
      strengths.push("Backend knowledge present");
    } else {
      missingSkills.push("API experience, Backend Frameworks");
      weaknesses.push("Limited backend experience");
    }
    if (skills.includes('react') || skills.includes('frontend')) {
      score += 10;
    }
  }

  score = Math.min(Math.max(score, 0), 100);

  let recommendation = "Potential Match";
  if (score >= 80) recommendation = "Strong Match";
  if (score < 50) recommendation = "Weak Match";

  await prisma.application.update({
    where: { id: appId },
    data: {
      aiScore: score,
      aiStrengths: JSON.stringify(strengths),
      aiWeaknesses: JSON.stringify(weaknesses),
      aiMissingSkills: JSON.stringify(missingSkills),
      aiRecommendation: recommendation
    }
  });

  await logSystemAction('Taksha HR completed AI analysis', application.name, `Score: ${score}/100, Rec: ${recommendation}`, 'Taksha HR');
};

const generateOfferPDF = async (application) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const filename = `Taksha_Nexus_Internship_Offer_${application.name.replace(/\s+/g, '_')}.pdf`;
      
      const offersDir = path.join(__dirname, 'uploads', 'offers');
      if (!fs.existsSync(offersDir)) {
        fs.mkdirSync(offersDir, { recursive: true });
      }
      
      const filePath = path.join(offersDir, filename);
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // Colors
      const colorNavy = '#0a192f';
      const colorOrange = '#f59e0b';
      const colorText = '#333333';

      // Paths to official assets
      const logoPath = 'C:/Users/kaman/.gemini/antigravity-ide/brain/33f24ccf-a69e-40ad-97a9-e495dba9c798/.user_uploaded/media_1788363071619.png';
      const sigPath = 'C:/Users/kaman/.gemini/antigravity-ide/brain/33f24ccf-a69e-40ad-97a9-e495dba9c798/.user_uploaded/media_1788363278011.png';
      const stampPath = 'C:/Users/kaman/.gemini/antigravity-ide/brain/33f24ccf-a69e-40ad-97a9-e495dba9c798/.user_uploaded/media_1788363232738.png';

      // Header
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 40, { width: 180 });
      } else {
        doc.fontSize(20).fillColor(colorNavy).text('TAKSHA NEXUS', 50, 50);
        doc.fontSize(10).fillColor(colorOrange).text('CRAFTING DIGITAL EXCELLENCE', 50, 75);
      }

      const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
      doc.fontSize(10).fillColor(colorText).font('Helvetica-Bold').text(`Date: ${date}`, 400, 60, { align: 'right' });

      // Divider
      doc.moveTo(50, 110).lineTo(545, 110).lineWidth(2).strokeColor(colorOrange).stroke();

      // Title
      doc.moveDown(3);
      doc.fontSize(18).fillColor(colorNavy).font('Helvetica-Bold').text('INTERNSHIP OFFER LETTER', { align: 'center' });
      doc.moveDown(2);

      // Recipient
      doc.fontSize(12).fillColor(colorText).font('Helvetica-Bold').text(`Dear ${application.name},`, 50, doc.y);
      doc.moveDown();

      // Paragraph 1
      doc.font('Helvetica').text(`We are pleased to offer you the position of `, { continued: true, align: 'justify', lineGap: 4 })
         .font('Helvetica-Bold').text(`${application.roleTitle} Intern`, { continued: true })
         .font('Helvetica').text(` at Taksha Nexus.`);
      
      doc.moveDown();
      doc.text(`Based on your application and evaluation, we are delighted to welcome you as an Intern and provide you with an opportunity to gain practical experience and contribute to meaningful projects within our organization.`, { align: 'justify', lineGap: 4 });
      doc.moveDown(2);

      // Internship Details Box
      const boxTop = doc.y;
      doc.rect(50, boxTop, 495, 20).fillAndStroke(colorNavy, colorNavy);
      doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(10);
      doc.text('INTERNSHIP DETAIL', 60, boxTop + 6);
      doc.text('INFORMATION', 250, boxTop + 6);

      const drawRow = (y, label, value) => {
        doc.rect(50, y, 495, 25).strokeColor('#E5E7EB').lineWidth(1).stroke();
        doc.fillColor(colorText).font('Helvetica-Bold').fontSize(10).text(label, 60, y + 8);
        doc.fillColor(colorText).font('Helvetica').text(value, 250, y + 8);
      };

      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 7); // Start in 7 days
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + parseInt(application.duration || '6'));

      let currentY = boxTop + 20;
      drawRow(currentY, 'POSITION', `${application.roleTitle} Intern`); currentY += 25;
      drawRow(currentY, 'DEPARTMENT', 'Product & Engineering'); currentY += 25;
      drawRow(currentY, 'START DATE', startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })); currentY += 25;
      drawRow(currentY, 'END DATE', endDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })); currentY += 25;
      drawRow(currentY, 'DURATION', application.duration || '6 Months'); currentY += 25;
      drawRow(currentY, 'WORK MODE', 'Remote'); currentY += 25;
      drawRow(currentY, 'WORKING HOURS', 'Flexible (5-6 Hours/Day)'); currentY += 25;
      drawRow(currentY, 'STIPEND', 'Performance Based'); currentY += 25;

      // Internship Terms
      doc.y = currentY + 30;
      doc.fontSize(11).fillColor(colorText).font('Helvetica').text(`During your internship, you will have the opportunity to work on practical assignments and projects while developing your professional and technical skills.`, { align: 'justify', lineGap: 4 });
      doc.moveDown();
      doc.text(`You are expected to maintain professionalism, follow Taksha Nexus guidelines, complete assigned responsibilities, and actively participate in your internship activities.`, { align: 'justify', lineGap: 4 });
      doc.moveDown();
      doc.text(`Your performance and participation during the internship will be evaluated based on your assigned responsibilities and overall contribution.`, { align: 'justify', lineGap: 4 });
      doc.moveDown(1.5);

      // Welcome Message
      doc.font('Helvetica-Bold').text(`We are excited to welcome you to Taksha Nexus and look forward to supporting your learning, growth, and professional journey with us.`, { align: 'justify', lineGap: 4 });
      doc.moveDown(3);

      // Closing
      doc.font('Helvetica').text(`Sincerely,`);
      doc.font('Helvetica-Bold').text(`For Taksha Nexus`);
      
      const sigY = doc.y + 10;
      if (fs.existsSync(sigPath)) {
        doc.image(sigPath, 50, sigY, { width: 120 });
      }

      doc.y = sigY + 80;
      doc.font('Helvetica-Bold').text(`Authorized Representative`);
      doc.font('Helvetica').text(`Taksha Nexus`);

      // Stamp
      if (fs.existsSync(stampPath)) {
        doc.image(stampPath, 300, sigY - 20, { width: 160 });
      }

      // Footer line
      doc.moveTo(50, 800).lineTo(545, 800).lineWidth(4).strokeColor(colorNavy).stroke();
      doc.moveTo(50, 800).lineTo(200, 800).lineWidth(4).strokeColor(colorOrange).stroke();

      doc.end();

      writeStream.on('finish', () => {
        resolve(filePath);
      });
    } catch (err) {
      reject(err);
    }
  });
};

const logSystemAction = async (action, candidate, result, performedBy) => {
  await prisma.systemLog.create({
    data: { action, candidate, result, performedBy }
  });
};

module.exports = {
  sendEmail,
  evaluateApplication,
  generateOfferPDF,
  logSystemAction
};
