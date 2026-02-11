const Faculty = require('../models/Faculty');
const Performance = require('../models/Performance');

const getAllReports = async (req, res) => {
  try {
    const performances = await Performance.find()
      .populate('facultyId')
      .sort({ createdAt: -1 });
    res.json(performances);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
};

const getFacultyReport = async (req, res) => {
  try {
    const performances = await Performance.find({ facultyId: req.params.id })
      .populate('facultyId')
      .sort({ createdAt: -1 });
    if (!performances.length) {
      const faculty = await Faculty.findById(req.params.id);
      if (!faculty) return res.status(404).json({ message: 'Faculty not found.' });
      return res.json([]);
    }
    res.json(performances);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
};

const getDepartmentReport = async (req, res) => {
  try {
    const { department } = req.query;
    if (!department) {
      return res.status(400).json({ message: 'Department query parameter is required.' });
    }
    const facultyList = await Faculty.find({ department });
    const facultyIds = facultyList.map((f) => f._id);
    const performances = await Performance.find({ facultyId: { $in: facultyIds } })
      .populate('facultyId')
      .sort({ createdAt: -1 });
    res.json(performances);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
};

module.exports = {
  getAllReports,
  getFacultyReport,
  getDepartmentReport,
};
