const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getJwtSecret } = require('../middleware/authMiddleware');

function signTokenForUser(userDoc) {
  return jwt.sign(
    {
      id: userDoc._id.toString(),
      email: userDoc.email,
      name: userDoc.name,
    },
    getJwtSecret(),
    { expiresIn: '7d' }
  );
}

function userResponseShape(userDoc) {
  return {
    id: userDoc._id.toString(),
    name: userDoc.name,
    email: userDoc.email,
  };
}

async function registerUserThing(req, res) {
  try {
    const name = (req.body?.name || '').toString().trim();
    const email = (req.body?.email || '').toString().trim().toLowerCase();
    const password = (req.body?.password || '').toString();

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = signTokenForUser(user);
    res.status(201).json({ token, user: userResponseShape(user) });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }
    res.status(500).json({ message: err?.message || 'something broke' });
  }
}

async function loginUserThing(req, res) {
  try {
    const email = (req.body?.email || '').toString().trim().toLowerCase();
    const password = (req.body?.password || '').toString();

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signTokenForUser(user);
    res.json({ token, user: userResponseShape(user) });
  } catch (err) {
    res.status(500).json({ message: err?.message || 'something broke' });
  }
}

module.exports = { registerUserThing, loginUserThing };
