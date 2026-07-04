require('dotenv').config();
const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!ADMIN_USER || !ADMIN_PASS || !SESSION_SECRET) {
  console.warn('WARNING: Using default credentials/secret. Set ADMIN_USER, ADMIN_PASS, and SESSION_SECRET in .env for production.');
}

const effectiveAdminUser = ADMIN_USER || 'admin';
const effectiveAdminPass = ADMIN_PASS || 'promotix123';
const effectiveSessionSecret = SESSION_SECRET || 'promotix-super-secret-key-change-in-production';

let activeAdminSession = null;

const CONTENT_FILE = path.join(__dirname, 'content.json');
const MESSAGES_FILE = path.join(__dirname, 'messages.json');

const VALID_CONTENT_KEYS = ['hero', 'about', 'services', 'process', 'faq', 'contact', 'stats', 'pricing'];

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

const loginAttempts = new Map();
setInterval(() => loginAttempts.clear(), 15 * 60 * 1000);

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many messages. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://cdnjs.cloudflare.com', "'unsafe-inline'"],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      connectSrc: ["'self'"],
      imgSrc: ["'self'", 'data:'],
      baseUri: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(session({
  secret: effectiveSessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000 }
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
  const ip = req.ip;
  const now = Date.now();
  const attempts = loginAttempts.get(ip) || [];
  const recent = attempts.filter(t => now - t < 15 * 60 * 1000);
  if (recent.length >= 10) return res.status(429).json({ error: 'Too many attempts. Try again later.' });
  recent.push(now);
  loginAttempts.set(ip, recent);
  const { username, password } = req.body;
  if (typeof username !== 'string' || typeof password !== 'string') return res.status(400).json({ error: 'Invalid input' });
  if (username === effectiveAdminUser && password === effectiveAdminPass) {
    loginAttempts.delete(ip);
    if (activeAdminSession) {
      const store = req.sessionStore;
      store.destroy(activeAdminSession, () => {});
    }
    req.session.regenerate(() => {
      req.session.isAdmin = true;
      activeAdminSession = req.session.id;
      res.json({ ok: true });
    });
    return;
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
  if (!req.body || typeof req.body !== 'object') return res.status(400).json({ error: 'Invalid content data' });
  const current = loadContent();
  const updated = { ...current };
  for (const key of Object.keys(req.body)) {
    if (VALID_CONTENT_KEYS.includes(key)) {
      updated[key] = req.body[key];
    }
  }
  saveContent(updated);
  res.json({ ok: true });
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'promotix-website.html')));

app.post('/api/contact', contactLimiter, (req, res) => {
  const s = v => typeof v === 'string' ? v.trim().slice(0, 2000) : '';
  const name = s(req.body.name), email = s(req.body.email), message = s(req.body.message);
  if (!name || !email || !message) return res.status(400).json({ error: 'Name, email, and message required' });
  if (name.length < 1 || email.length < 3 || message.length < 2) return res.status(400).json({ error: 'Fields too short' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Invalid email' });
  const company = s(req.body.company), service = s(req.body.service);
  let msgs = [];
  try { msgs = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8') || '[]'); } catch { msgs = []; }
  msgs.push({ id: Date.now(), name, email, company, service, message, date: new Date().toISOString(), read: false });
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

app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.use((req, res) => res.status(404).sendFile(path.join(__dirname, 'promotix-website.html')));

app.listen(PORT, () => {
  console.log(`Promotix server running at http://localhost:${PORT}`);
  console.log(`Admin panel at http://localhost:${PORT}/admin.html`);
});
