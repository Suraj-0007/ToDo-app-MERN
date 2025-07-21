const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  const task = new Task({ userId: req.user, text: req.body.text });
  await task.save();
  res.json(task);
});

router.get('/', auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.user });
  res.json(tasks);
});

router.put('/:id', auth, async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user },
    req.body,
    { new: true }
  );
  res.json(task);
});

router.delete('/:id', auth, async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, userId: req.user });
  res.json({ message: 'Deleted' });
});

module.exports = router;
