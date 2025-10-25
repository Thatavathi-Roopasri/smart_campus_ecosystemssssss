const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
let loadedEnv = false;
const envPaths = [
  path.join(__dirname, '.env'),
  path.join(process.cwd(), '.env'),
  path.join(__dirname, '..', '.env')
];
for (const p of envPaths) {
  const res = require('dotenv').config({ path: p });
  if (res.parsed) { loadedEnv = p; break; }
}
console.log('ENV loaded from:', loadedEnv || 'none');

const apiRouter = require('./routes/api');
const Event = require('./models/Event');

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

const PORT = process.env.PORT || 5000;
// Build Mongo URI: prefer MONGODB_URI, else compose from parts
function getMongoUri() {
  const user = process.env.MONGODB_USER || process.env['\uFEFFMONGODB_USER'];
  const pass = process.env.MONGODB_PASSWORD || process.env['\uFEFFMONGODB_PASSWORD'];
  const host = process.env.MONGODB_HOST || process.env['\uFEFFMONGODB_HOST']; // e.g., project01.bmejhvq.mongodb.net
  const db = process.env.MONGODB_DB || process.env['\uFEFFMONGODB_DB'] || 'smartcampus';
  console.log('Env presence -> user:', !!user, 'host:', !!host, 'db:', !!db);
  if (user && pass && host) {
    const uri = `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}/${encodeURIComponent(db)}?retryWrites=true&w=majority&appName=Project01`;
    console.log('Mongo URI source: component vars (USER/PASSWORD/HOST/DB)');
    return uri;
  }
  const direct = process.env.MONGODB_URI || process.env['\uFEFFMONGODB_URI'];
  if (direct) {
    console.log('Mongo URI source: MONGODB_URI');
    return direct;
  }
  return null;
}
const MONGODB_URI = getMongoUri();

async function start() {
  try {
    if (!MONGODB_URI) {
      console.error('MONGODB_URI not set. Please create backend/.env and define MONGODB_URI.');
      console.error('Loaded env keys:', Object.keys(process.env).filter(k => k.toLowerCase().includes('mongo')).join(', ') || 'none');
      process.exit(1);
    }
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Seed events if none
    const count = await Event.countDocuments();
    if (count === 0) {
      await Event.insertMany([
        { title: 'Tech Fest 2025', description: 'Hackathons, workshops, and keynote talks.', posterUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop', venue: 'Main Auditorium', startAt: new Date(Date.now() + 86400000) },
        { title: 'AI Seminar', description: 'Trends in GenAI and ML safety.', posterUrl: 'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?q=80&w=1200&auto=format&fit=crop', venue: 'Block B, Seminar Hall', startAt: new Date(Date.now() + 172800000) },
        { title: 'Cultural Night', description: 'Music, dance, and food stalls.', posterUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop', venue: 'Open Grounds', startAt: new Date(Date.now() + 259200000) }
      ]);
      console.log('Seeded sample events');
    }

    app.use('/api', apiRouter);

    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
