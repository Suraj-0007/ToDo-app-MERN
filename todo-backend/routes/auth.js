const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hash });
  await user.save();
  res.json({ msg: "User created" });
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ error: "Invalid" });

  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid" });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

module.exports = router;
