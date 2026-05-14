const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
    // keeping old field for older existing docs (safe to remove after migration)
    date: { type: String },
  },
  { _id: false }
);

const jobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    status: { type: String, default: 'Apply Later' },
    techStack: [{ type: String }],
    url: { type: String },
    interviewDate: { type: String },
    notes: [noteSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);

