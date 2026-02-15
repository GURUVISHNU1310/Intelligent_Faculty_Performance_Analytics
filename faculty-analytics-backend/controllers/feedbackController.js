const Feedback = require('../models/Feedback');
const mongoose = require('mongoose');

// Student submits or updates feedback for a faculty (STUDENT only - enforced in route)
const submitFeedback = async (req, res) => {
  try {
    const { facultyId, score } = req.body;
    if (facultyId === undefined || score === undefined) {
      return res.status(400).json({ message: 'Faculty ID and score are required.' });
    }
    const numScore = Number(score);
    if (Number.isNaN(numScore) || numScore < 0 || numScore > 100) {
      return res.status(400).json({ message: 'Score must be between 0 and 100.' });
    }
    const feedback = await Feedback.findOneAndUpdate(
      { userId: req.user._id, facultyId },
      { score: numScore },
      { new: true, upsert: true, runValidators: true }
    ).populate('facultyId', 'name department designation');
    res.json(feedback);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate feedback.' });
    }
    res.status(500).json({ message: error.message || 'Server error.' });
  }
};

// Get current user's (student's) feedbacks
const getMyFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ userId: req.user._id })
      .populate('facultyId', 'name email department designation')
      .sort({ updatedAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
};

// Average feedback score for a faculty (used as teaching score)
const getFacultyFeedbackSummary = async (req, res) => {
  try {
    const facultyId = req.params.facultyId;
    const result = await Feedback.aggregate([
      { $match: { facultyId: new mongoose.Types.ObjectId(facultyId) } },
      { $group: { _id: '$facultyId', avgScore: { $avg: '$score' }, count: { $sum: 1 } } },
    ]);
    if (!result.length) return res.json({ facultyId, averageScore: 0, count: 0 });
    res.json({ facultyId, averageScore: Math.round(result[0].avgScore), count: result[0].count });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
};

// All faculty feedback averages (for Dashboard/Reports - live from students)
const getAllFeedbackSummaries = async (req, res) => {
  try {
    const Faculty = require('../models/Faculty');
    const summaries = await Feedback.aggregate([
      { $group: { _id: '$facultyId', avgScore: { $avg: '$score' }, count: { $sum: 1 } } },
      { $lookup: { from: 'faculties', localField: '_id', foreignField: '_id', as: 'faculty' } },
      { $unwind: { path: '$faculty', preserveNullAndEmptyArrays: true } },
      { $project: { facultyId: '$_id', facultyName: '$faculty.name', averageScore: { $round: ['$avgScore', 0] }, count: 1 } },
    ]);
    const result = summaries.map((s) => ({
      facultyId: s.facultyId,
      facultyName: s.facultyName || 'Faculty',
      averageScore: s.averageScore || 0,
      count: s.count || 0,
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
};

module.exports = { submitFeedback, getMyFeedbacks, getFacultyFeedbackSummary, getAllFeedbackSummaries };
