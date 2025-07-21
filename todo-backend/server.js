require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

// ✅ TEMPORARY: Allow all origins for testing (do not use in production)
app.use(cors({
  origin: true,
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
