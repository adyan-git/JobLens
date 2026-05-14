const express = require('express');
const { addJob, getJobs, addNoteToJobThing } = require('../controllers/jobController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, addJob);
router.get('/', authMiddleware, getJobs);
router.put('/:id/notes', authMiddleware, addNoteToJobThing);

module.exports = router;

