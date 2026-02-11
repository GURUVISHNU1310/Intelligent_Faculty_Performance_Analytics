const Faculty = require('../models/Faculty');

const addFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.create(req.body);
    res.status(201).json(faculty);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Faculty with this email already exists.' });
    }
    res.status(500).json({ message: error.message || 'Server error.' });
  }
};

const getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find().sort({ createdAt: -1 });
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
};

const getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) return res.status(404).json({ message: 'Faculty not found.' });
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
};

const updateFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!faculty) return res.status(404).json({ message: 'Faculty not found.' });
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
};

const deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);
    if (!faculty) return res.status(404).json({ message: 'Faculty not found.' });
    res.json({ message: 'Faculty deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
};

module.exports = {
  addFaculty,
  getAllFaculty,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
};
