require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const allowedOrigins = [
  'http://localhost:3000',
  'https://to-do-app-mern-plum.vercel.app',
  'https://to-do-app-mern-git-main-suraj-0007s-projects.vercel.app',
  'https://to-do-app-mern-j0qyme3i3-suraj-0007s-projects.vercel.app'
];

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log('✅ Server running');
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
