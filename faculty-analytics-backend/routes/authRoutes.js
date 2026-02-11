const express = require('express');
const router = express.Router();
const { loginUser, registerUser, logoutUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/logout', authMiddleware, logoutUser);

module.exports = router;
