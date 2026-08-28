const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { Resend } = require('resend');
const path = require('path');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_123');
app.use(cors());
app.use(express.json());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../dist')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Taksha Backend API is running' });
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
    
    const intern = await prisma.user.create({
      data: {
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
    
    // Don't send password hash back
    const { passwordHash: _, ...internData } = intern;
    res.json(internData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create intern (email might exist)' });
  }
});

// --- TASKS & PROJECTS API ---
app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: { tasks: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(projects);
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
        include: { project: true }
      });
    } else {
      tasks = await prisma.task.findMany({
        include: { project: true }
      }); // Mentor sees all
    }
    // Map assigneeId to assignee for frontend compatibility
    res.json(tasks.map(t => ({ ...t, assignee: t.assigneeId })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/api/tasks', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'MENTOR') return res.status(403).json({ error: 'Only mentors can assign tasks' });
    
    const { title, projectId, priority, assignee, status } = req.body;
    
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
app.post('/api/submissions', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'INTERN') return res.status(403).json({ error: 'Only interns can submit work' });
    
    const { projectId, githubUrl, liveUrl, description } = req.body;
    
    // Create the submission
    const submission = await prisma.submission.create({
      data: {
        projectId,
        internId: req.user.id,
        githubUrl,
        liveUrl,
        description,
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
        task: { include: { project: true } }
      }
    });

    // Update the associated task status
    const taskStatus = status === 'Approved' ? 'DONE' : 'CHANGES_REQUESTED';
    await prisma.task.update({
      where: { id: submission.taskId },
      data: {
        status: taskStatus,
        feedback: mentorFeedback
      }
    });

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
      from: 'Taksha Careers <website@taksha.studio>',
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
    
    const application = await prisma.application.update({
      where: { id },
      data: { status }
    });
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// All other GET requests not handled before will return our React app
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
