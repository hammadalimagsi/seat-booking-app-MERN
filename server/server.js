require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const seedSeats = require('./config/seedSeats');

const app = express();

// Connect to MongoDB
connectDB()
  .then(() => {
    seedSeats().catch(err => console.error('Seed error:', err));
  })
  .catch(err => console.error('Initial DB connect error:', err));

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/seats', require('./routes/seats'));

// Health check
app.get('/', async (req, res) => {
  const isDbConnected = await connectDB();
  res.send(`🚀 DineReserve API is running... (Database: ${isDbConnected ? '✅ Connected' : '❌ Disconnected'})`);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: `Server error: ${err.message}` });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;
