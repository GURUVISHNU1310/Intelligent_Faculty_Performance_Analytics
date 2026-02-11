const express = require('express');
const router = express.Router();
const {
  addFaculty,
  getAllFaculty,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
} = require('../controllers/facultyController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);
router.get('/', getAllFaculty);
router.get('/:id', getFacultyById);
router.post('/', roleMiddleware('ADMIN', 'HOD'), addFaculty);
router.put('/:id', roleMiddleware('ADMIN', 'HOD'), updateFaculty);
router.delete('/:id', roleMiddleware('ADMIN', 'HOD'), deleteFaculty);

module.exports = router;
