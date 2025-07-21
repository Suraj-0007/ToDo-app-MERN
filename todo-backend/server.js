require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

// ✅ CORS setup for Vercel frontend
app.use(cors({
  origin: ['https://to-do-app-mern-plum.vercel.app'],
  credentials: true
}));

app.use(express.json());

// ✅ API routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log('Server running');
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));
