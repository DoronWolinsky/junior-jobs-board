import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

//retrieving all jobs
app.get("/jobs", (req, res) => {
  const rows = db.prepare("SELECT * FROM jobs").all();
  res.json(rows);
});

// creating a new job
app.post("/jobs", (req, res) => {
  const { title, company, description, location, tags } = req.body;
  const stmt = db.prepare(`
    INSERT INTO jobs (title, company, description, location, tags)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(title, company, description, location, tags);
  res.json({ id: info.lastInsertRowid });
});

// retrieving a job by id
app.get("/jobs/:id", (req, res) => {
  const job = db.prepare("SELECT * FROM jobs WHERE id = ?").get(req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
});

// updating a job
app.put("/jobs/:id", (req, res) => {
  const { title, company, description, location, tags } = req.body;
  const stmt = db.prepare(`
    UPDATE jobs SET title=?, company=?, description=?, location=?, tags=?
    WHERE id=?
  `);
  const info = stmt.run(title, company, description, location, tags, req.params.id);
  res.json({ updated: info.changes > 0 });
});

// deleting a job
app.delete("/jobs/:id", (req, res) => {
  const stmt = db.prepare("DELETE FROM jobs WHERE id=?");
  const info = stmt.run(req.params.id);
  res.json({ deleted: info.changes > 0 });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

