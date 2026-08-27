const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const path = require('path');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
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

// --- TASKS API ---
app.get('/api/tasks', authenticateToken, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'INTERN') {
      tasks = await prisma.task.findMany({ where: { assigneeId: req.user.id } });
    } else {
      tasks = await prisma.task.findMany(); // Mentor sees all
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
    
    const { title, project, priority, assignee, status } = req.body;
    
    const task = await prisma.task.create({
      data: {
        title,
        project,
        priority: priority || 'Medium',
        status: status || 'TODO',
        date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        assigneeId: assignee,
        assignerId: req.user.id
      }
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
    const { status, submissionLink, feedback } = req.body;
    
    const task = await prisma.task.update({
      where: { id },
      data: { status, submissionLink, feedback }
    });
    res.json({ ...task, assignee: task.assigneeId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task' });
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

// All other GET requests not handled before will return our React app
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
