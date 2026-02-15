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

const Faculty = require('../models/Faculty');
const ALLOWED_ROLES = ['ADMIN', 'HOD', 'FACULTY', 'STUDENT'];

const registerUser = async (req, res) => {
  try {
    const { username, password, role, email: facultyEmail } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password is required (min 6 characters).' });
    }
    const chosenRole = role && ALLOWED_ROLES.includes(role.toUpperCase()) ? role.toUpperCase() : 'FACULTY';

    let loginUsername = username && username.trim() ? username.trim() : null;

    if (chosenRole === 'FACULTY') {
      const email = (facultyEmail || username || '').toString().trim().toLowerCase();
      if (!email) {
        return res.status(400).json({ message: 'Faculty email is required. Use the email your admin added for you.' });
      }
      const facultyRecord = await Faculty.findOne({ email });
      if (!facultyRecord) {
        return res.status(400).json({ message: 'No faculty record found with this email. Ask admin to add you as faculty first.' });
      }
      if (facultyRecord.userId) {
        return res.status(400).json({ message: 'This faculty email is already registered. Sign in or use another email.' });
      }
      loginUsername = email;
      const existingUser = await User.findOne({ username: loginUsername });
      if (existingUser) {
        return res.status(400).json({ message: 'An account with this email already exists. Sign in instead.' });
      }
      const user = await User.create({
        username: loginUsername,
        password,
        role: 'FACULTY',
      });
      facultyRecord.userId = user._id;
      await facultyRecord.save();
      const token = jwt.sign(
        { id: user._id, role: user.role, username: user.username },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES }
      );
      return res.status(201).json({
        message: 'Registration successful',
        token,
        user: { id: user._id, username: user.username, role: user.role },
      });
    }

    if (!loginUsername) {
      return res.status(400).json({ message: 'Username is required.' });
    }
    const existing = await User.findOne({ username: loginUsername });
    if (existing) return res.status(400).json({ message: 'Username already exists.' });
    const user = await User.create({
      username: loginUsername,
      password,
      role: chosenRole,
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
