const express = require('express');
const router = express.Router();
const {
  getAllReports,
  getFacultyReport,
  getDepartmentReport,
} = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.get('/', getAllReports);
router.get('/faculty/:id', getFacultyReport);
router.get('/department', getDepartmentReport);

module.exports = router;
