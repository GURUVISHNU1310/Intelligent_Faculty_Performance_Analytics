const Performance = require('../models/Performance');
const { calculatePerformanceScore } = require('../utils/calculatePerformance');

const addPerformance = async (req, res) => {
  try {
    const { facultyId, teachingScore, studentFeedback, attendance, researchPapers, adminWork } = req.body;
    const { totalScore, performanceLevel } = calculatePerformanceScore(
      teachingScore, studentFeedback, attendance, researchPapers, adminWork
    );
    const performance = await Performance.create({
      facultyId,
      teachingScore,
      studentFeedback,
      attendance,
      researchPapers,
      adminWork,
      totalScore,
      performanceLevel,
    });
    const populated = await Performance.findById(performance._id).populate('facultyId');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
};

const getPerformanceByFaculty = async (req, res) => {
  try {
    const performances = await Performance.find({ facultyId: req.params.facultyId })
      .populate('facultyId')
      .sort({ createdAt: -1 });
    res.json(performances);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
};

const updatePerformance = async (req, res) => {
  try {
    const { teachingScore, studentFeedback, attendance, researchPapers, adminWork } = req.body;
    const existing = await Performance.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Performance record not found.' });
    const { totalScore, performanceLevel } = calculatePerformanceScore(
      teachingScore ?? existing.teachingScore,
      studentFeedback ?? existing.studentFeedback,
      attendance ?? existing.attendance,
      researchPapers ?? existing.researchPapers,
      adminWork ?? existing.adminWork
    );
    const performance = await Performance.findByIdAndUpdate(
      req.params.id,
      { ...req.body, totalScore, performanceLevel },
      { new: true, runValidators: true }
    ).populate('facultyId');
    res.json(performance);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
};

const deletePerformance = async (req, res) => {
  try {
    const performance = await Performance.findByIdAndDelete(req.params.id);
    if (!performance) return res.status(404).json({ message: 'Performance record not found.' });
    res.json({ message: 'Performance deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
};

const calculatePerformanceScoreHandler = async (req, res) => {
  try {
    const { teachingScore, studentFeedback, attendance, researchPapers, adminWork } = req.body;
    const result = calculatePerformanceScore(
      teachingScore, studentFeedback, attendance, researchPapers, adminWork
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
};

module.exports = {
  addPerformance,
  getPerformanceByFaculty,
  updatePerformance,
  deletePerformance,
  calculatePerformanceScoreHandler,
};
