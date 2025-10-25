const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const LostFound = require('../models/LostFound');
const Feedback = require('../models/Feedback');
const Voice = require('../models/Voice');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 🔐 KLH-only signup and login
router.post('/auth/signup', async (req, res) => {
  try {
    const { email, password, name, role } = req.body || {};

    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });

    // ✅ Allow only KLH email
    if (!email.endsWith("@klh.edu.in")) {
      return res.status(400).json({ error: 'Use your KLH email only!' });
    }

    const normalizedRole = (role || 'student').toString().toLowerCase();
    if (normalizedRole === 'admin' || normalizedRole === 'hod') {
      return res.status(403).json({ error: 'Signup not permitted for this role' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(409).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      role: normalizedRole || 'student',
      name: name || ''
    });

    res.status(201).json({
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Signup failed' });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });

    // ✅ Allow only KLH email
    if (!email.endsWith("@klh.edu.in")) {
      return res.status(400).json({ error: 'Use your KLH email only!' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { sub: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '2d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Your other routes 👇
router.get('/events', async (req, res) => {
  const items = await Event.find().sort({ startAt: 1 }).lean();
  res.json(items);
});

router.post('/events', async (req, res) => {
  const b = req.body || {};
  const ev = await Event.create({
    title: b.title || 'Untitled',
    description: b.description || '',
    posterUrl: b.posterUrl || '',
    venue: b.venue || '',
    startAt: b.startAt ? new Date(b.startAt) : new Date()
  });
  res.status(201).json(ev);
});

// Edit event (title, description, posterUrl, venue, startAt)
router.put('/events/:id', async (req, res) => {
  const { id } = req.params;
  const b = req.body || {};
  const updates = {
    ...(b.title !== undefined && { title: b.title }),
    ...(b.description !== undefined && { description: b.description }),
    ...(b.posterUrl !== undefined && { posterUrl: b.posterUrl }),
    ...(b.venue !== undefined && { venue: b.venue }),
    ...(b.startAt !== undefined && { startAt: new Date(b.startAt) })
  };
  const ev = await Event.findByIdAndUpdate(id, updates, { new: true });
  if (!ev) return res.status(404).json({ error: 'Event not found' });
  res.json(ev);
});

// Add interested student roll number
router.post('/events/:id/interest', async (req, res) => {
  const { id } = req.params;
  const { roll } = req.body || {};
  if (!roll || typeof roll !== 'string') return res.status(400).json({ error: 'roll is required' });
  const ev = await Event.findById(id);
  if (!ev) return res.status(404).json({ error: 'Event not found' });
  if (!ev.interestedRolls.includes(roll)) ev.interestedRolls.push(roll);
  await ev.save();
  res.json({ ok: true, interestedRolls: ev.interestedRolls });
});

router.get('/lost-found', async (req, res) => {
  const items = await LostFound.find().sort({ timeReported: -1 }).lean();
  res.json(items);
});

router.post('/lost-found', async (req, res) => {
  const b = req.body || {};
  const item = await LostFound.create({
    type: b.type === 'found' ? 'found' : 'lost',
    title: b.title || '',
    description: b.description || '',
    category: b.category || 'other',
    imageData: b.imageData || '',
    whereText: b.whereText || '',
    timeReported: b.timeReported ? new Date(b.timeReported) : new Date(),
    status: 'open'
  });
  res.status(201).json(item);
});

router.get('/feedbacks', async (req, res) => {
  const items = await Feedback.find().sort({ createdAt: -1 }).lean();
  res.json(items);
});

router.post('/feedbacks', async (req, res) => {
  const b = req.body || {};
  const fb = await Feedback.create({
    subject: b.subject || '',
    category: b.category || 'other',
    description: b.description || '',
    imageData: b.imageData || '',
    status: 'open'
  });
  res.status(201).json(fb);
});

router.get('/voice', async (req, res) => {
  const items = await Voice.find().sort({ createdAt: -1 }).lean();
  res.json(items);
});

router.post('/voice', async (req, res) => {
  const b = req.body || {};
  const v = await Voice.create({
    content: b.content || '',
    imageData: b.imageData || ''
  });
  res.status(201).json(v);
});

module.exports = router;