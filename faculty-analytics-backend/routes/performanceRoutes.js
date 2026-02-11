const express = require('express');
const router = express.Router();
const {
  addPerformance,
  getPerformanceByFaculty,
  updatePerformance,
  deletePerformance,
  calculatePerformanceScoreHandler,
} = require('../controllers/performanceController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);
router.get('/:facultyId', getPerformanceByFaculty);
router.post('/', roleMiddleware('ADMIN', 'HOD'), addPerformance);
router.put('/:id', roleMiddleware('ADMIN', 'HOD'), updatePerformance);
router.delete('/:id', roleMiddleware('ADMIN', 'HOD'), deletePerformance);
router.post('/calculate', calculatePerformanceScoreHandler);

module.exports = router;
