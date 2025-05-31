const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Middleware
const authMiddleware = require('../middleware/authMiddleware');

// ✅ GET logged-in user info
router.get('/user', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// ✅ REGISTER with role support
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword, role });
    const savedUser = await newUser.save();

    res.status(201).json({ message: 'User registered', user: savedUser.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ LOGIN includes role
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Include role in JWT payload
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email, role: user.role },
      'secretKey'
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
