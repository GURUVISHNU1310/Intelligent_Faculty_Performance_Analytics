const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'faculty-analytics-secret-key';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });
    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );
    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
};

const registerUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Username already exists.' });
    const user = await User.create({
      username,
      password,
      role: role || 'FACULTY',
    });
    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
};

const logoutUser = async (req, res) => {
  res.json({ message: 'Logged out successfully.' });
};

module.exports = { loginUser, registerUser, logoutUser };
