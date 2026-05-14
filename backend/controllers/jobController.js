const Job = require('../models/Job');
const { normalizeJobRoleTitle } = require('../utils/roleNormalize');

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

    const roleNormalized = normalizeJobRoleTitle(role);
    if (!roleNormalized) {
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
        ? [{ text: notes.trim(), createdAt: new Date() }]
        : [];

    const createdJob = await Job.create({
      userId: req.user.id,
      company,
      role: roleNormalized,
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
    const jobs = await Job.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err?.message || 'something broke' });
  }
}

async function addNoteToJobThing(req, res) {
  try {
    const jobId = req.params?.id;
    const noteText = (req.body?.noteText || req.body?.text || '').toString().trim();

    if (!jobId) {
      return res.status(400).json({ message: 'job id is required' });
    }

    if (!noteText) {
      return res.status(400).json({ message: 'noteText is required' });
    }

    const jobDoc = await Job.findOne({ _id: jobId, userId: req.user.id });

    if (!jobDoc) {
      return res.status(404).json({ message: 'job not found' });
    }

    jobDoc.notes = Array.isArray(jobDoc.notes) ? jobDoc.notes : [];
    jobDoc.notes.push({
      text: noteText,
      createdAt: new Date(),
    });

    const updatedJob = await jobDoc.save();
    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ message: err?.message || 'something broke' });
  }
}

module.exports = { addJob, getJobs, addNoteToJobThing };

