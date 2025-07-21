const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    text: String,
    completed: { type: Boolean, default: false },
  },
  {
    timestamps: true, // ✅ This enables createdAt and updatedAt
  }
);

module.exports = mongoose.model('Task', taskSchema);
