const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

const dbPath = path.join(__dirname, 'database.db');
let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/');
    });
  } catch (e) {
    console.log(`DATABASE ERROR: ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

const SECRET_KEY = 'b4d90ddd38f06cac6fa7a339183972bf38481f41b1f23c0c431f2c101d330acf';

// User Signup API
app.post('/signup', async (req, res) => {
  const { name, email, mobile, password } = req.body;
  if (!name || !email || !mobile || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run('INSERT INTO users (name, email, mobile, password) VALUES (?, ?, ?, ?)', [
      name,
      email,
      mobile,
      hashedPassword,
    ]);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});

// User Login API
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

// Create Job Listing
app.post('/api/jobs', authenticateToken, async (req, res) => {
  const { title, description, location, jobType, salaryRange } = req.body;
  await db.run('INSERT INTO jobs (title, description, location, jobType, salaryRange, userId) VALUES (?, ?, ?, ?, ?, ?)',
    [title, description, location, jobType, salaryRange, req.user.id]);
  res.status(201).json({ message: 'Job created successfully' });
});

// Get All Job Listings
app.get('/api/jobs', async (req, res) => {
  const jobs = await db.all('SELECT * FROM jobs');
  res.json(jobs);
});

// Get Single Job Listing
app.get('/api/jobs/:id', async (req, res) => {
  const job = await db.get('SELECT * FROM jobs WHERE id = ?', [req.params.id]);
  job ? res.json(job) : res.status(404).json({ error: 'Job not found' });
});

// Update Job Listing
app.put('/api/jobs/:id', authenticateToken, async (req, res) => {
  const { title, description, location, jobType, salaryRange } = req.body;
  await db.run('UPDATE jobs SET title = ?, description = ?, location = ?, jobType = ?, salaryRange = ? WHERE id = ? AND userId = ?',
    [title, description, location, jobType, salaryRange, req.params.id, req.user.id]);
  res.json({ message: 'Job updated successfully' });
});

// Delete Job Listing
app.delete('/api/jobs/:id', authenticateToken, async (req, res) => {
  await db.run('DELETE FROM jobs WHERE id = ? AND userId = ?', [req.params.id, req.user.id]);
  res.json({ message: 'Job deleted successfully' });
});

// Bookmark a Job
app.post('/api/bookmarks/:jobId', authenticateToken, async (req, res) => {
  await db.run('INSERT INTO bookmarks (userId, jobId) VALUES (?, ?)', [req.user.id, req.params.jobId]);
  res.json({ message: 'Job bookmarked successfully' });
});

// Get Bookmarked Jobs
app.get('/api/bookmarks', authenticateToken, async (req, res) => {
  const jobs = await db.all('SELECT jobs.* FROM jobs JOIN bookmarks ON jobs.id = bookmarks.jobId WHERE bookmarks.userId = ?', [req.user.id]);
  res.json(jobs);
});

module.exports=app;