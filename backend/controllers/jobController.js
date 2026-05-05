const Job = require('../models/Job');

async function addJob(req, res) {
  try {
    const {
      company,
      role,
      status,
      techStack,
      url,
      interviewDate,
      notes,
    } = req.body || {};

    if (!company || !role) {
      return res.status(400).json({ message: 'company and role are required' });
    }

    const techStackArray = Array.isArray(techStack)
      ? techStack
      : typeof techStack === 'string'
        ? techStack.split(',').map((x) => x.trim()).filter(Boolean)
        : [];

    const notesArray = Array.isArray(notes)
      ? notes
      : typeof notes === 'string' && notes.trim()
        ? [{ text: notes.trim(), date: new Date().toISOString() }]
        : [];

    const createdJob = await Job.create({
      company,
      role,
      status,
      techStack: techStackArray,
      url,
      interviewDate,
      notes: notesArray,
    });

    res.status(201).json(createdJob);
  } catch (err) {
    res.status(500).json({ message: err?.message || 'something broke' });
  }
}

async function getJobs(req, res) {
  try {
    const jobs = await Job.find({}).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err?.message || 'something broke' });
  }
}

module.exports = { addJob, getJobs };

