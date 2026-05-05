const express = require('express');
const { addJob, getJobs } = require('../controllers/jobController');

const router = express.Router();

router.post('/', addJob);
router.get('/', getJobs);

module.exports = router;

