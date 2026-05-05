const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    status: { type: String, default: 'Apply Later' },
    techStack: [{ type: String }],
    url: { type: String },
    interviewDate: { type: String },
    notes: [
      {
        text: { type: String, required: true },
        date: { type: String, default: () => new Date().toISOString() },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);

