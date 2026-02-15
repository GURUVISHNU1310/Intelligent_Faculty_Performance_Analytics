const express = require('express');
const router = express.Router();
const { submitFeedback, getMyFeedbacks, getFacultyFeedbackSummary, getAllFeedbackSummaries } = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

// Only students can submit feedback
router.post('/', roleMiddleware('STUDENT'), submitFeedback);
// My feedbacks (student sees their own)
router.get('/my', getMyFeedbacks);
// Summary for a faculty (average score + count)
router.get('/summary/:facultyId', getFacultyFeedbackSummary);
// All faculty feedback averages (live from students)
router.get('/all-summaries', getAllFeedbackSummaries);

module.exports = router;
