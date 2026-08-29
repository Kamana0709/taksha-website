const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { Resend } = require('resend');
const path = require('path');
const { addDays, differenceInCalendarDays } = require('date-fns');
const multer = require('multer');
const fs = require('fs');
const { generateCertificatePdf } = require('./generateCertificatePdf');
const generateCertificateHtml = require('./certificateTemplate');
const { PROJECT_TEMPLATES } = require('./projectTemplates');
const { uploadFile, getPublicUrl } = require('./storage');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_123');
app.use(cors());
app.use(express.json());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../dist')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer storage config (Migrated to memory for Supabase)
// Keep uploads directory creation as a fallback/legacy
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /pdf|zip|png|jpg|jpeg|fig/;
    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error("Error: File upload only supports the following filetypes - pdf, zip, png, jpg, jpeg, fig"));
  }
});

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Taksha Nexus Backend API is running' });
});

// --- MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

// --- AUTH API ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ 
      token, 
      user: { id: user.id, name: user.name, email: user.email, role: user.role, track: user.track, initials: user.name.substring(0, 2).toUpperCase() } 
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// --- USERS API (Interns) ---
app.get('/api/users/interns', authenticateToken, async (req, res) => {
  try {
    // Mentors can see their interns
    const interns = await prisma.user.findMany({
      where: { role: 'INTERN', mentorId: req.user.id }
    });
    res.json(interns);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch interns' });
  }
});

app.post('/api/users/interns', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'MENTOR') return res.status(403).json({ error: 'Only mentors can create interns' });
    
    const { name, email, password, track } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    
    const year = new Date().getFullYear();
    const count = await prisma.user.count({
      where: { 
        role: 'INTERN',
        id: { startsWith: `TNX-INT-${year}-` }
      }
    });
    const seq = String(count + 1).padStart(3, '0');
    const customInternId = `TNX-INT-${year}-${seq}`;
    
    const intern = await prisma.user.create({
      data: {
        id: customInternId,
        name,
        email,
        passwordHash,
        role: 'INTERN',
        track: track || 'Frontend',
        progress: 0,
        status: 'On Track',
        mentorId: req.user.id
      }
    });
    
    const template1 = PROJECT_TEMPLATES.find(t => t.order === 1);
    if (template1) {
      await assignProjectTemplateToIntern(intern.id, template1.key, req.user.id);
    }
    
    const { passwordHash: _, ...internData } = intern;
    res.json(internData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create intern (email might exist)' });
  }
});

app.delete('/api/users/interns/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'MENTOR') return res.status(403).json({ error: 'Only mentors can delete interns' });
    const { id } = req.params;
    
    // Perform cascading delete manually in a transaction
    await prisma.$transaction([
      prisma.task.deleteMany({ where: { assigneeId: id } }),
      prisma.submission.deleteMany({ where: { internId: id } }),
      prisma.certificate.deleteMany({ where: { internId: id } }),
      prisma.message.deleteMany({ where: { senderId: id } }),
      prisma.message.deleteMany({ where: { receiverId: id } }),
      prisma.user.delete({ where: { id } })
    ]);
    
    res.json({ success: true, id });
  } catch (err) {
    console.error('Failed to delete intern:', err);
    res.status(500).json({ error: 'Failed to delete intern' });
  }
});

app.put('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const { phone, location } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { phone, location }
    });
    
    // Return sanitized user object
    const { passwordHash: _, ...userData } = user;
    res.json({
      ...userData,
      initials: userData.name.substring(0, 2).toUpperCase()
    });
  } catch (err) {
    console.error('Failed to update profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// --- TASKS & PROJECTS API ---
app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: { 
        tasks: true,
        assignments: req.user.role === 'INTERN' ? { where: { internId: req.user.id } } : true
      },
      orderBy: { createdAt: 'desc' }
    });
    const enhancedProjects = projects.map(p => {
      let daysRemaining = null;
      // If intern, grab their specific assignment
      const assignment = req.user.role === 'INTERN' && p.assignments.length > 0 
        ? p.assignments[0] 
        : null;
        
      if (assignment && assignment.deadlineAt) {
        daysRemaining = differenceInCalendarDays(new Date(assignment.deadlineAt), new Date());
      }
      return { ...p, daysRemaining, assignments: undefined };
    });
    res.json(enhancedProjects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'MENTOR') return res.status(403).json({ error: 'Only mentors can create projects' });
    const { name, description } = req.body;
    const project = await prisma.project.create({
      data: { name, description }
    });
    // Add empty tasks array for immediate frontend state
    res.json({ ...project, tasks: [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

app.get('/api/tasks', authenticateToken, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'INTERN') {
      tasks = await prisma.task.findMany({ 
        where: { assigneeId: req.user.id },
        include: { project: { include: { assignments: { where: { internId: req.user.id } } } } }
      });
    } else {
      tasks = await prisma.task.findMany({
        include: { project: { include: { assignments: true } } }
      }); // Mentor sees all
    }
    // Map assigneeId to assignee for frontend compatibility
    res.json(tasks.map(t => {
      let project = t.project;
      if (project) {
        // Find assignment for this specific task's assignee
        const assignment = project.assignments?.find(a => a.internId === t.assigneeId);
        
        if (assignment && assignment.deadlineAt) {
          project = {
            ...project,
            daysRemaining: differenceInCalendarDays(new Date(assignment.deadlineAt), new Date())
          };
        }
        delete project.assignments;
      }
      return { ...t, assignee: t.assigneeId, project };
    }));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/api/tasks', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'MENTOR') return res.status(403).json({ error: 'Only mentors can assign tasks' });
    
    const { title, projectId, priority, assignee, status } = req.body;
    
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (project) {
      const now = new Date();
      await prisma.projectAssignment.upsert({
        where: { projectId_internId: { projectId, internId: assignee } },
        update: {},
        create: {
          projectId,
          internId: assignee,
          assignedAt: now,
          deadlineDays: project.deadlineDays,
          deadlineAt: addDays(now, project.deadlineDays)
        }
      });
    }

    const task = await prisma.task.create({
      data: {
        title,
        projectId,
        priority: priority || 'Medium',
        status: status || 'TODO',
        date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        assigneeId: assignee,
        assignerId: req.user.id
      },
      include: { project: true }
    });
    res.json({ ...task, assignee: task.assigneeId });
  } catch (err) {
    console.error('Failed to create task:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.put('/api/tasks/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const task = await prisma.task.update({
      where: { id },
      data: { status },
      include: { project: true }
    });
    res.json({ ...task, assignee: task.assigneeId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task status' });
  }
});

app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'MENTOR') return res.status(403).json({ error: 'Only mentors can edit tasks' });
    const { id } = req.params;
    const { title, projectId, priority, status, assignee } = req.body;
    
    const task = await prisma.task.update({
      where: { id },
      data: { 
        title, 
        ...(projectId && { projectId }), 
        priority, 
        status,
        ...(assignee && { assigneeId: assignee })
      },
      include: { project: true }
    });
    res.json({ ...task, assignee: task.assigneeId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'MENTOR') return res.status(403).json({ error: 'Only mentors can delete tasks' });
    const { id } = req.params;
    await prisma.task.delete({ where: { id } });
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// --- SUBMISSIONS API ---
app.post('/api/submissions', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (req.user.role !== 'INTERN') return res.status(403).json({ error: 'Only interns can submit work' });
    
    const { projectId, githubUrl, liveUrl, description } = req.body;
    let fileUrl = null;
    let fileName = null;
    
    if (req.file) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(req.file.originalname);
      const objectPath = `${uniqueSuffix}${ext}`;
      
      // Upload to private bucket
      await uploadFile('submissions', objectPath, req.file.buffer, req.file.mimetype);
      
      // Get a long-lived signed URL (10 years) to match previous static URL behavior
      const { getSignedUrl } = require('./storage');
      fileUrl = await getSignedUrl('submissions', objectPath, 315360000);
      fileName = req.file.originalname;
    }
    
    // Create the submission
    const submission = await prisma.submission.create({
      data: {
        projectId,
        internId: req.user.id,
        githubUrl,
        liveUrl,
        description,
        fileUrl,
        fileName,
        status: 'Submitted'
      },
      include: {
        project: true,
        intern: true
      }
    });

    res.json(submission);
  } catch (err) {
    console.error('Failed to create submission:', err);
    res.status(500).json({ error: 'Failed to create submission' });
  }
});

app.get('/api/submissions', authenticateToken, async (req, res) => {
  try {
    let submissions;
    if (req.user.role === 'INTERN') {
      submissions = await prisma.submission.findMany({
        where: { internId: req.user.id },
        include: { project: true, intern: true, reviewedBy: true },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      submissions = await prisma.submission.findMany({
        include: { project: true, intern: true, reviewedBy: true },
        orderBy: { createdAt: 'desc' }
      });
    }
    res.json(submissions);
  } catch (err) {
    console.error('Failed to fetch submissions:', err);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

app.put('/api/submissions/:id/review', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'MENTOR') return res.status(403).json({ error: 'Only mentors can review submissions' });
    
    const { id } = req.params;
    const { status, mentorFeedback } = req.body; // status is 'Approved' or 'Changes Requested'
    
    const submission = await prisma.submission.update({
      where: { id },
      data: {
        status,
        mentorFeedback,
        reviewedAt: new Date(),
        reviewedById: req.user.id
      },
      include: {
        project: true
      }
    });

    if (status === 'Approved') {
      const proj = submission.project;
      if (proj) {
        const officialTemplate = PROJECT_TEMPLATES.find(t => t.name === proj.name);
        if (officialTemplate) {
          await unlockNextProject(submission.internId, officialTemplate.key);
        }
      }
    }

    res.json(submission);
  } catch (err) {
    console.error('Failed to review submission:', err);
    res.status(500).json({ error: 'Failed to update submission' });
  }
});

// --- ANNOUNCEMENTS API ---
app.get('/api/announcements', authenticateToken, async (req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({ orderBy: { date: 'desc' } });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

app.post('/api/announcements', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'MENTOR') return res.status(403).json({ error: 'Only mentors can post' });
    const announcement = await prisma.announcement.create({
      data: { ...req.body, authorId: req.user.id }
    });
    res.json(announcement);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

// --- APPLICATIONS API ---
app.post('/api/applications', async (req, res) => {
  try {
    const { name, email, portfolio, message, roleId, roleTitle } = req.body;
    
    // 1. Save to Database
    const application = await prisma.application.create({
      data: {
        name,
        email,
        portfolio,
        message,
        roleId,
        roleTitle,
        date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
      }
    });

    // 2. Send Email Notification
    const { data: emailData, error } = await resend.emails.send({
      from: 'Taksha Nexus Careers <website@taksha.studio>',
      to: 'takshadigital@gmail.com',
      subject: `New Application: ${name} for ${roleTitle}`,
      html: `
        <h2>New Job Application</h2>
        <p><strong>Role:</strong> ${roleTitle} (${roleId})</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Portfolio/LinkedIn:</strong> <a href="${portfolio}">${portfolio}</a></p>
        <h3>Message/Cover Letter:</h3>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `
    });

    if (error) {
      console.error('Email failed to send, but application was saved.', error);
      // We still return success since it's in the DB
    }

    res.status(201).json({ success: true, application });
  } catch (err) {
    console.error('Failed to submit application:', err);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

app.get('/api/applications', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'MENTOR') return res.status(403).json({ error: 'Only mentors can view applications' });
    const applications = await prisma.application.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

app.put('/api/applications/:id/status', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'MENTOR') return res.status(403).json({ error: 'Only mentors can update applications' });
    const { id } = req.params;
    const { status } = req.body;
    
    const application = await prisma.$transaction(async (tx) => {
      const app = await tx.application.update({
        where: { id },
        data: { status }
      });
      
      if (status === 'Accepted') {
        const existingUser = await tx.user.findUnique({ where: { email: app.email } });
        if (!existingUser) {
          const defaultPassword = Math.random().toString(36).slice(-8); // Random password for new interns
          const passwordHash = await bcrypt.hash(defaultPassword, 10);
          
          let track = 'Frontend';
          if (app.roleTitle.toLowerCase().includes('design')) track = 'Design';
          else if (app.roleTitle.toLowerCase().includes('backend')) track = 'Backend';
          
          await tx.user.create({
            data: {
              name: app.name,
              email: app.email,
              passwordHash,
              role: 'INTERN',
              track,
              progress: 0,
              status: 'On Track',
              mentorId: req.user.id
            }
          });
        }
      }
      return app;
    });
    
    if (status === 'Accepted') {
      const intern = await prisma.user.findUnique({ where: { email: application.email } });
      if (intern) {
        const template1 = PROJECT_TEMPLATES.find(t => t.order === 1);
        if (template1) {
          await assignProjectTemplateToIntern(intern.id, template1.key, req.user.id);
        }
      }
    }
    
    res.json(application);
  } catch (err) {
    console.error('Failed to update application status:', err);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// --- CERTIFICATES API ---
app.get('/api/certificates/:internId/eligible', authenticateToken, async (req, res) => {
  try {
    const { internId } = req.params;
    
    // Eligibility: all assigned tasks across all projects are DONE, and all submissions are Approved
    const tasks = await prisma.task.findMany({ where: { assigneeId: internId } });
    const submissions = await prisma.submission.findMany({ where: { internId } });
    
    if (tasks.length === 0 || submissions.length === 0) {
      return res.json({ isEligible: false });
    }
    
    const allTasksDone = tasks.every(t => t.status === 'DONE');
    const allSubmissionsApproved = submissions.every(s => s.status === 'Approved' || s.status === 'Auto-Submitted');
    
    const existingCert = await prisma.certificate.findFirst({ where: { internId } });
    
    res.json({ 
      isEligible: allTasksDone && allSubmissionsApproved, 
      alreadyIssued: !!existingCert,
      certificate: existingCert 
    });
  } catch (err) {
    console.error('Failed to check eligibility:', err);
    res.status(500).json({ error: 'Failed to check certificate eligibility' });
  }
});

app.post('/api/certificates/generate', authenticateToken, async (req, res) => {
  try {
    const { internId } = req.body;
    
    if (req.user.role !== 'MENTOR' && req.user.id !== internId) {
      return res.status(403).json({ error: 'Unauthorized to generate certificate' });
    }
    
    const intern = await prisma.user.findUnique({ where: { id: internId } });
    if (!intern) return res.status(404).json({ error: 'Intern not found' });
    
    const existingCert = await prisma.certificate.findFirst({ where: { internId } });
    if (existingCert) {
      return res.json({ success: true, certificate: existingCert, fileUrl: existingCert.fileUrl || `/uploads/certificates/${existingCert.id}.pdf` });
    }
    
    const year = new Date().getFullYear();
    const count = await prisma.certificate.count({
      where: { certificateNumber: { startsWith: `TK/IC/${year}/` } }
    });
    const seq = String(count + 1).padStart(4, '0');
    const certificateNumber = `TK/IC/${year}/${seq}`;
    
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    const startDateStr = startDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    const endDateStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    
    const approvedSubmissions = await prisma.submission.findMany({
      where: { 
        internId,
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
    
    const certsDir = path.join(__dirname, 'uploads', 'certificates');
    if (!fs.existsSync(certsDir)) {
      fs.mkdirSync(certsDir, { recursive: true });
    }
    
    const crypto = require('crypto');
    const certId = crypto.randomUUID();
    const filePath = path.join(certsDir, `${certId}.pdf`);
    
    // Generate PDF using LaTeX pipeline
    await generateCertificatePdf({
      name: intern.name,
      role: intern.track || 'Frontend Developer',
      startDate: startDateStr,
      endDate: endDateStr,
      certificateId: certificateNumber
    }, filePath);
    
    // Upload the generated PDF to Supabase Storage
    const fileBuffer = fs.readFileSync(filePath);
    const objectPath = `${certId}.pdf`;
    await uploadFile('certificates', objectPath, fileBuffer, 'application/pdf');
    const supabaseUrl = getPublicUrl('certificates', objectPath);
    
    const newCert = await prisma.certificate.create({
      data: {
        id: certId,
        certificateNumber,
        role: intern.track || 'Frontend Developer',
        startDate: startDateStr,
        endDate: endDateStr,
        projectsCompleted,
        internId,
        fileUrl: supabaseUrl
      }
    });
    
    res.json({ success: true, certificate: newCert, fileUrl: supabaseUrl });
  } catch (err) {
    console.error('Failed to generate certificate:', err);
    res.status(500).json({ error: 'Failed to generate certificate' });
  }
});

app.get('/api/certificates/verify/:certificateNumber', async (req, res) => {
  try {
    const { certificateNumber } = req.params;
    
    // Decode if encoded (e.g. TK%2FIC%2F2026%2F0001)
    const decodedNumber = decodeURIComponent(certificateNumber);
    
    const certificate = await prisma.certificate.findUnique({
      where: { certificateNumber: decodedNumber },
      include: {
        intern: {
          select: { name: true }
        }
      }
    });
    
    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    
    res.json({
      internName: certificate.intern.name,
      role: certificate.role,
      startDate: certificate.startDate,
      endDate: certificate.endDate,
      issuedAt: certificate.issuedAt,
      projectsCompleted: certificate.projectsCompleted || []
    });
  } catch (err) {
    console.error('Failed to verify certificate:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/certificates/:id/download', async (req, res) => {
  try {
    const { id } = req.params;
    const cert = await prisma.certificate.findUnique({ where: { id } });
    if (!cert) return res.status(404).json({ error: 'Certificate not found' });
    
    if (cert.fileUrl && cert.fileUrl.startsWith('http')) {
      // Supabase storage
      return res.redirect(cert.fileUrl);
    }
    
    // Fallback to local disk
    const filePath = path.join(__dirname, 'uploads', 'certificates', `${id}.pdf`);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
    
    res.download(filePath, `Taksha-Nexus-Certificate-${cert.certificateNumber.replace(/\//g, '-')}.pdf`);
  } catch (err) {
    console.error('Failed to download certificate:', err);
    res.status(500).json({ error: 'Failed to download certificate' });
  }
});

// --- MESSAGING API ---
app.get('/api/messages/unread-count', authenticateToken, async (req, res) => {
  try {
    const count = await prisma.message.count({
      where: {
        receiverId: req.user.id,
        read: false
      }
    });
    res.json({ unreadCount: count });
  } catch (err) {
    console.error('Failed to get unread messages count:', err);
    res.status(500).json({ error: 'Failed to fetch unread messages count' });
  }
});

app.get('/api/messages/:otherUserId', authenticateToken, async (req, res) => {
  try {
    const { otherUserId } = req.params;
    
    await prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: req.user.id,
        read: false
      },
      data: { read: true }
    });

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: req.user.id }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });
    
    res.json(messages);
  } catch (err) {
    console.error('Failed to fetch messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/messages', authenticateToken, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    
    if (!receiverId || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const me = await prisma.user.findUnique({ where: { id: req.user.id } });
    const them = await prisma.user.findUnique({ where: { id: receiverId } });

    if (!them) return res.status(404).json({ error: 'Receiver not found' });

    if (me.role === 'INTERN') {
      if (me.mentorId !== receiverId) {
        return res.status(403).json({ error: 'Interns can only message their assigned mentor' });
      }
    } else if (me.role === 'MENTOR') {
      if (them.mentorId !== me.id) {
        return res.status(403).json({ error: 'Mentors can only message their assigned interns' });
      }
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId: req.user.id,
        receiverId
      }
    });

    res.status(201).json(message);
  } catch (err) {
    console.error('Failed to send message:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// --- ANALYTICS API ---
app.get('/api/reports/summary', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'MENTOR') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const tasks = await prisma.task.findMany({
      where: { assignerId: req.user.id }
    });
    const interns = await prisma.user.findMany({
      where: { mentorId: req.user.id, role: 'INTERN' }
    });
    
    const internIds = interns.map(i => i.id);
    const submissions = await prisma.submission.findMany({
      where: { internId: { in: internIds } }
    });

    const summary = {
      tasks: {
        total: tasks.length || 1,
        todo: tasks.filter(t => t.status === 'TODO').length,
        inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
        review: tasks.filter(t => t.status === 'REVIEW').length,
        done: tasks.filter(t => t.status === 'DONE').length,
      },
      interns: {
        total: interns.length || 1,
        onTrack: interns.filter(i => i.status === 'On Track').length,
        behind: interns.filter(i => i.status === 'Behind').length,
        atRisk: interns.filter(i => i.status === 'At Risk').length,
      },
      submissions: {
        total: submissions.length,
        approved: submissions.filter(s => s.status === 'Approved').length,
        pending: submissions.filter(s => s.status === 'Submitted').length
      }
    };

    res.json(summary);
  } catch (err) {
    console.error('Failed to get summary:', err);
    res.status(500).json({ error: 'Failed to fetch summary reports' });
  }
});

app.get('/api/reports/weekly-progress', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'MENTOR') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { differenceInWeeks, startOfWeek } = require('date-fns');
    
    const doneTasks = await prisma.task.findMany({
      where: {
        assignerId: req.user.id,
        status: 'DONE'
      },
      select: { updatedAt: true }
    });
    
    const now = new Date();
    const weeks = Array(8).fill(0).map((_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (i * 7));
      return { 
        label: `W${8 - i}`, 
        weekStart: startOfWeek(d), 
        count: 0 
      };
    }).reverse();

    doneTasks.forEach(t => {
      const diff = differenceInWeeks(now, t.updatedAt);
      if (diff >= 0 && diff < 8) {
        weeks[7 - diff].count++;
      }
    });

    res.json(weeks);
  } catch (err) {
    console.error('Failed to get weekly progress:', err);
    res.status(500).json({ error: 'Failed to fetch weekly progress' });
  }
});

// --- PROJECT TEMPLATES API ---
app.get('/api/project-templates', authenticateToken, (req, res) => {
  res.json(PROJECT_TEMPLATES);
});

const assignProjectTemplateToIntern = async (internId, templateKey, assignerId) => {
  const template = PROJECT_TEMPLATES.find(t => t.key === templateKey);
  if (!template) return null;

  const intern = await prisma.user.findUnique({ where: { id: internId } });
  if (!intern) return null;
  
  const mentorId = assignerId || intern.mentorId;
  if (!mentorId) return null;

  let project = await prisma.project.findFirst({
    where: { name: template.name }
  });

  if (!project) {
    project = await prisma.project.create({
      data: {
        name: template.name,
        description: template.description
      }
    });
  }

  const today = new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  const createdTasks = [];
  
  const now = new Date();
  await prisma.projectAssignment.upsert({
    where: { projectId_internId: { projectId: project.id, internId: intern.id } },
    update: {},
    create: {
      projectId: project.id,
      internId: intern.id,
      assignedAt: now,
      deadlineDays: project.deadlineDays || 7,
      deadlineAt: addDays(now, project.deadlineDays || 7)
    }
  });

  for (const item of template.checklist) {
    const taskTitle = typeof item === 'string' ? item : item.title;
    const taskSkills = typeof item === 'string' ? [] : (item.skills || []);

    const existingTask = await prisma.task.findFirst({
      where: {
        title: taskTitle,
        projectId: project.id,
        assigneeId: intern.id
      }
    });

    if (!existingTask) {
      const newTask = await prisma.task.create({
        data: {
          title: taskTitle,
          projectId: project.id,
          assigneeId: intern.id,
          assignerId: mentorId,
          priority: 'Medium',
          status: 'TODO',
          date: today,
          skillTags: taskSkills
        },
        include: {
          assignee: { select: { id: true, name: true, email: true } },
          assigner: { select: { id: true, name: true, email: true } },
          project: { select: { id: true, name: true } }
        }
      });
      createdTasks.push(newTask);
    }
  }
  return { project, tasks: createdTasks };
};

const unlockNextProject = async (internId, completedProjectKey) => {
  try {
    const completedTemplate = PROJECT_TEMPLATES.find(t => t.key === completedProjectKey);
    if (!completedTemplate || !completedTemplate.order) return;
    
    const nextTemplate = PROJECT_TEMPLATES.find(t => t.order === completedTemplate.order + 1);
    if (!nextTemplate) return; 
    
    await assignProjectTemplateToIntern(internId, nextTemplate.key);
  } catch (err) {
    console.error('Failed to unlock next project:', err);
  }
};

app.post('/api/project-templates/assign', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'MENTOR') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { templateKey, internId } = req.body;
    if (!templateKey || !internId) {
      return res.status(400).json({ error: 'templateKey and internId are required' });
    }

    const template = PROJECT_TEMPLATES.find(t => t.key === templateKey);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const intern = await prisma.user.findUnique({ where: { id: internId } });
    if (!intern || intern.role !== 'INTERN' || intern.mentorId !== req.user.id) {
      return res.status(403).json({ error: 'Invalid intern or unauthorized' });
    }

    // Check unlocking constraint for manual assignments
    if (template.order > 1) {
      const prevTemplate = PROJECT_TEMPLATES.find(t => t.order === template.order - 1);
      if (prevTemplate) {
        const prevProject = await prisma.project.findFirst({ where: { name: prevTemplate.name } });
        let prevCompleted = false;
        
        if (prevProject) {
          const prevAssignment = await prisma.projectAssignment.findUnique({
            where: { projectId_internId: { projectId: prevProject.id, internId: intern.id } }
          });
          
          if (prevAssignment && prevAssignment.status === 'AUTO_SUBMITTED') {
            prevCompleted = true;
          } else {
            const approvedSubmission = await prisma.submission.findFirst({
              where: { projectId: prevProject.id, internId: intern.id, status: 'Approved' }
            });
            if (approvedSubmission) prevCompleted = true;
          }
        }
        
        // Also allow if this template is ALREADY assigned to the intern
        const currentProject = await prisma.project.findFirst({ where: { name: template.name } });
        let alreadyAssigned = false;
        if (currentProject) {
           const currentAssignment = await prisma.projectAssignment.findUnique({
             where: { projectId_internId: { projectId: currentProject.id, internId: intern.id } }
           });
           if (currentAssignment) alreadyAssigned = true;
        }

        if (!prevCompleted && !alreadyAssigned) {
          return res.status(400).json({ error: `Intern must complete Project ${template.order - 1} before starting Project ${template.order}` });
        }
      }
    }

    const result = await assignProjectTemplateToIntern(intern.id, template.key, req.user.id);
    
    if (!result) {
      return res.status(500).json({ error: 'Failed to assign project template' });
    }

    const mappedTasks = result.tasks.map(newTask => ({
      ...newTask,
      assignee: newTask.assigneeId,
      assigner: newTask.assignerId,
      assigneeName: newTask.assignee?.name,
      assignerName: newTask.assigner?.name
    }));

    res.status(201).json({ project: result.project, tasks: mappedTasks });
  } catch (err) {
    console.error('Failed to assign project template:', err);
    res.status(500).json({ error: 'Failed to assign project template' });
  }
});

// All other GET requests not handled before will return our React app
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

const autoSubmitOverdueProjects = async () => {
  try {
    const now = new Date();
    const overdueAssignments = await prisma.projectAssignment.findMany({
      where: { deadlineAt: { lt: now }, status: 'IN_PROGRESS' },
      include: { project: true }
    });

    for (const assignment of overdueAssignments) {
      await prisma.projectAssignment.update({
        where: { id: assignment.id },
        data: { status: 'AUTO_SUBMITTED' }
      });

      const existingSubmission = await prisma.submission.findFirst({
        where: { projectId: assignment.projectId, internId: assignment.internId }
      });

      if (!existingSubmission) {
        await prisma.submission.create({
          data: {
            projectId: assignment.projectId,
            internId: assignment.internId,
            githubUrl: "",
            description: "Automatically submitted after 7-day deadline.",
            status: "Auto-Submitted"
          }
        });
      }
      
      const proj = assignment.project;
      if (proj) {
        const officialTemplate = PROJECT_TEMPLATES.find(t => t.name === proj.name);
        if (officialTemplate) {
          await unlockNextProject(assignment.internId, officialTemplate.key);
        }
      }
    }
  } catch (err) {
    console.error('Failed to auto-submit overdue projects:', err);
  }
};

autoSubmitOverdueProjects();
setInterval(autoSubmitOverdueProjects, 60 * 60 * 1000);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
