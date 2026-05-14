const express = require('express');
const { registerUserThing, loginUserThing } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUserThing);
router.post('/login', loginUserThing);

module.exports = router;
