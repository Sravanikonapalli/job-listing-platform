const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

const dbPath = path.join(__dirname, "database.db");
let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });
    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        mobile TEXT NOT NULL,
        password TEXT NOT NULL
      );
    `);
    
    await db.run(`
      CREATE TABLE IF NOT EXISTS jobs (
        JobID INTEGER PRIMARY KEY AUTOINCREMENT,
        Role TEXT NOT NULL,
        Employees INTEGER NOT NULL,
        WorkMode TEXT NOT NULL,
        Skills TEXT NOT NULL,
        JobType TEXT NOT NULL,
        Stipend INTEGER NOT NULL,
        Location TEXT NOT NULL,
        AboutJobInternship TEXT NOT NULL,
        AboutCompany TEXT NOT NULL,
        AdditionalInformation TEXT NOT NULL,
        Duration TEXT NOT NULL,
        userId INTEGER NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DATABASE ERROR: ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

const SECRET_KEY = "3fb6468dcbba0132833710ce1a00309726d71c045570d4d0bee642d4156e7552"; 

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.user = user;
    next();
  });
};

app.post("/signup", async (req, res) => {
  const { name, email, mobile, password } = req.body;
  if (!name || !email || !mobile || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run(
      `INSERT INTO users (name, email, mobile, password) VALUES (?, ?, ?, ?)`,
      [name, email, mobile, hashedPassword]
    );
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating user" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error logging in" });
  }
});

app.post("/api/jobs", authenticateToken, async (req, res) => {
  const {
    Role, Employees, WorkMode, Skills, JobType, Stipend, Location,
    AboutJobInternship, AboutCompany, AdditionalInformation, Duration
  } = req.body;

  const validJobTypes = ["Internship", "Full-Time", "Part-Time", "Contractual"];
  const validWorkModes = ["Office", "Remote", "Hybrid"];
  const allowedSkills = ["HTML", "CSS", "JavaScript", "React", "Node.js", "SQL", "Python", "Java"];

  if (!validJobTypes.includes(JobType)) {
    return res.status(400).json({ error: `Invalid JobType. Allowed: ${validJobTypes.join(", ")}` });
  }
  if (!validWorkModes.includes(WorkMode)) {
    return res.status(400).json({ error: `Invalid WorkMode. Allowed: ${validWorkModes.join(", ")}` });
  }

  const skillsArray = Array.isArray(Skills) ? Skills : Skills.split(", ").map(skill => skill.trim());
  if (skillsArray.some(skill => !allowedSkills.includes(skill))) {
    return res.status(400).json({ error: `Invalid Skills. Allowed: ${allowedSkills.join(", ")}` });
  }

  if (AboutCompany.length < 200 || AboutJobInternship.length < 200 || AdditionalInformation.length < 200) {
    return res.status(400).json({ error: "AboutCompany, AboutJobInternship, and AdditionalInformation must be at least 200 characters." });
  }

  try {
    await db.run(
      `INSERT INTO jobs (Role, Employees, WorkMode, Skills, JobType, Stipend, Location, AboutJobInternship, AboutCompany, AdditionalInformation, Duration, userId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [Role, Employees, WorkMode, skillsArray.join(", "), JobType, Stipend, Location, AboutJobInternship, AboutCompany, AdditionalInformation, Duration, req.user.id]
    );
    res.status(201).json({ message: "Job created successfully" });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ error: "Error creating job" });
  }
});

app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await db.all("SELECT JobID, Role, Employees, WorkMode, Skills, JobType, Stipend, Location FROM jobs");
    res.json(jobs);
  } catch (error) {
    console.error("Error getting all jobs", error);
    res.status(500).json({ error: "Error getting jobs" });
  }
});

app.get("/api/jobs/:id", async (req, res) => {
  try {
    const job = await db.get("SELECT * FROM jobs WHERE JobID = ?", [req.params.id]);
    job ? res.json(job) : res.status(404).json({ error: "Job not found" });
  } catch (error) {
    console.error("Error getting single job", error);
    res.status(500).json({ error: "Error getting job details" });
  }
});

app.put("/api/jobs/:id", authenticateToken, async (req, res) => {
  const { Role, Employees, WorkMode, Skills, JobType, Stipend, Location, AboutJobInternship, AboutCompany, AdditionalInformation, Duration } = req.body;
  try {
    await db.run(
      `UPDATE jobs SET Role = ?, Employees = ?, WorkMode = ?, Skills = ?, JobType = ?, Stipend = ?, Location = ?, AboutJobInternship = ?, AboutCompany = ?, AdditionalInformation = ?, Duration = ? WHERE JobID = ? AND userId = ?`,
      [Role, Employees, WorkMode, Skills, JobType, Stipend, Location, AboutJobInternship, AboutCompany, AdditionalInformation, Duration, req.params.id, req.user.id]
    );
    res.json({ message: "Job updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating job" });
  }
});

app.delete("/api/jobs/:id", authenticateToken, async (req, res) => {
  try {
    await db.run("DELETE FROM jobs WHERE JobID = ? AND userId = ?", [req.params.id, req.user.id]);
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting job" });
  }
});

module.exports = app;
