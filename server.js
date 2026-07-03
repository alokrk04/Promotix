const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'promotix123';
const SESSION_SECRET = process.env.SESSION_SECRET || 'promotix-super-secret-key-change-in-production';

let activeAdminSession = null;

const CONTENT_FILE = path.join(__dirname, 'content.json');
const MESSAGES_FILE = path.join(__dirname, 'messages.json');

function loadContent() {
  try {
    return JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf-8'));
  } catch {
    return null;
  }
}

function saveContent(data) {
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
}));

function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin && req.session.id === activeAdminSession) return next();
  req.session.isAdmin = false;
  res.status(401).json({ error: 'Unauthorized' });
}

app.get('/api/content', (req, res) => {
  const content = loadContent();
  if (content) return res.json(content);
  res.status(500).json({ error: 'Content not found' });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    if (activeAdminSession) {
      const store = req.sessionStore;
      store.destroy(activeAdminSession, () => {});
    }
    req.session.isAdmin = true;
    activeAdminSession = req.session.id;
    return res.json({ ok: true });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

app.post('/api/logout', (req, res) => {
  if (req.session.id === activeAdminSession) activeAdminSession = null;
  req.session.destroy();
  res.json({ ok: true });
});

app.get('/api/check-auth', (req, res) => {
  res.json({ isAdmin: !!req.session.isAdmin });
});

app.post('/api/content', requireAdmin, (req, res) => {
  const current = loadContent();
  const updated = { ...current, ...req.body };
  saveContent(updated);
  res.json({ ok: true });
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'promotix-website.html')));

app.post('/api/contact', (req, res) => {
  const { name, email, company, service, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Name, email, and message required' });
  let msgs = [];
  try { msgs = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8') || '[]'); } catch { msgs = []; }
  msgs.push({ id: Date.now(), name, email, company: company || '', service: service || '', message, date: new Date().toISOString(), read: false });
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(msgs, null, 2));
  res.json({ ok: true });
});

app.get('/api/messages', requireAdmin, (req, res) => {
  try { res.json(JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8') || '[]')); }
  catch { res.json([]); }
});

app.post('/api/messages/read/:id', requireAdmin, (req, res) => {
  try {
    let msgs = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8') || '[]');
    msgs = msgs.map(m => m.id == req.params.id ? { ...m, read: true } : m);
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(msgs, null, 2));
    res.json({ ok: true });
  } catch { res.status(500).json({ error: 'Failed' }); }
});

app.post('/api/messages/delete/:id', requireAdmin, (req, res) => {
  try {
    let msgs = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8') || '[]');
    msgs = msgs.filter(m => m.id != req.params.id);
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(msgs, null, 2));
    res.json({ ok: true });
  } catch { res.status(500).json({ error: 'Failed' }); }
});

app.use(express.static(__dirname, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    }
  }
}));

app.listen(PORT, () => {
  console.log(`Promotix server running at http://localhost:${PORT}`);
  console.log(`Admin panel at http://localhost:${PORT}/admin.html`);
});
