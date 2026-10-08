/**
 * MATERNA AI 2.0 - BACKEND REST API SERVER
 * Optional Node.js/Express server providing cloud persistence,
 * clinical export, and AI assistant webhook support.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..')));

// Helper for local JSON database
function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = { profile: {}, vitals: [], meds: [], chat: [] };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
      return initial;
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (e) {
    return { profile: {}, vitals: [], meds: [], chat: [] };
  }
}

function writeDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Materna AI 2.0 Backend', timestamp: new Date().toISOString() });
});

// GET Profile
app.get('/api/profile', (req, res) => {
  const db = readDb();
  res.json(db.profile || {});
});

// POST Profile
app.post('/api/profile', (req, res) => {
  const db = readDb();
  db.profile = { ...db.profile, ...req.body, updatedAt: new Date().toISOString() };
  writeDb(db);
  res.json({ success: true, profile: db.profile });
});

// GET Vitals
app.get('/api/vitals', (req, res) => {
  const db = readDb();
  res.json(db.vitals || []);
});

// POST Vitals
app.post('/api/vitals', (req, res) => {
  const db = readDb();
  const entry = { id: 'vit-' + Date.now(), timestamp: new Date().toISOString(), ...req.body };
  db.vitals.push(entry);
  writeDb(db);
  res.status(201).json({ success: true, entry });
});

// GET Medications
app.get('/api/meds', (req, res) => {
  const db = readDb();
  res.json(db.meds || []);
});

// POST Medications
app.post('/api/meds', (req, res) => {
  const db = readDb();
  db.meds = req.body;
  writeDb(db);
  res.json({ success: true, count: db.meds.length });
});

// AI Chat Webhook Endpoint (ready for external LLM or Gemini API bridge)
app.post('/api/chat', (req, res) => {
  const { message, profile } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  // Safety check on server side
  const lower = message.toLowerCase();
  const isEmergency = /bleeding|spotting|severe headache|blurred vision|water break|fluid leak/i.test(lower);

  if (isEmergency) {
    return res.json({
      text: '🚨 **SAFETY ALERT:** What you described requires immediate evaluation. Please sit down calmly and call your obstetrician or hospital maternity emergency triage immediately.',
      isEmergency: true
    });
  }

  res.json({
    text: `Server companion received: "${message}". Client rule-engine and AI assistant are fully synchronized.`,
    isEmergency: false
  });
});

// Full Clinical Export
app.get('/api/export', (req, res) => {
  const db = readDb();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=materna-cloud-export.json');
  res.send(JSON.stringify(db, null, 2));
});

// SPA Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🌸 Materna AI 2.0 Backend Server running on http://localhost:${PORT}`);
});
