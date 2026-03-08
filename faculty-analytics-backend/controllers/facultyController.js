const Faculty = require('../models/Faculty');
const User = require('../models/User');

const addFaculty = async (req, res) => {
  try {
    // If HOD is creating a faculty, force the department to their own department
    if (req.user.role === 'HOD') {
      const hodFaculty = await Faculty.findOne({ userId: req.user._id });
      if (!hodFaculty) {
        return res
          .status(403)
          .json({ message: 'HOD profile not found. Cannot determine department.' });
      }
      req.body.department = hodFaculty.department;
    }

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
    let filter = {};

    if (req.user.role === 'HOD') {
      const hodFaculty = await Faculty.findOne({ userId: req.user._id });
      if (!hodFaculty) {
        return res
          .status(403)
          .json({ message: 'HOD profile not found. Cannot determine department.' });
      }
      filter.department = hodFaculty.department;
    }

    // Exclude HODs themselves from the faculty list
    const hodUsers = await User.find({ role: 'HOD' }).select('_id');
    if (hodUsers.length > 0) {
      const hodUserIds = hodUsers.map((u) => u._id);
      filter.userId = { $nin: hodUserIds };
    }

    const faculty = await Faculty.find(filter).sort({ createdAt: -1 });
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
};

const getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) return res.status(404).json({ message: 'Faculty not found.' });

    if (req.user.role === 'HOD') {
      const hodFaculty = await Faculty.findOne({ userId: req.user._id });
      if (!hodFaculty) {
        return res
          .status(403)
          .json({ message: 'HOD profile not found. Cannot determine department.' });
      }
      if (faculty.department !== hodFaculty.department) {
        return res
          .status(403)
          .json({ message: 'Access denied. You can only access faculty from your department.' });
      }
    }

    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
};

const getMyFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ userId: req.user._id });
    if (!faculty) return res.status(404).json({ message: 'Faculty profile not found.' });
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
};

const updateFaculty = async (req, res) => {
  try {
    const existingFaculty = await Faculty.findById(req.params.id);
    if (!existingFaculty) return res.status(404).json({ message: 'Faculty not found.' });

    if (req.user.role === 'HOD') {
      const hodFaculty = await Faculty.findOne({ userId: req.user._id });
      if (!hodFaculty) {
        return res
          .status(403)
          .json({ message: 'HOD profile not found. Cannot determine department.' });
      }
      if (existingFaculty.department !== hodFaculty.department) {
        return res
          .status(403)
          .json({ message: 'Access denied. You can only modify faculty from your department.' });
      }

      // Ensure HOD cannot move faculty to another department
      req.body.department = hodFaculty.department;
    }

    const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
};

const deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) return res.status(404).json({ message: 'Faculty not found.' });

    if (req.user.role === 'HOD') {
      const hodFaculty = await Faculty.findOne({ userId: req.user._id });
      if (!hodFaculty) {
        return res
          .status(403)
          .json({ message: 'HOD profile not found. Cannot determine department.' });
      }
      if (faculty.department !== hodFaculty.department) {
        return res
          .status(403)
          .json({ message: 'Access denied. You can only delete faculty from your department.' });
      }
    }

    if (faculty.userId) {
      await User.findByIdAndDelete(faculty.userId);
    }

    await faculty.deleteOne();

    res.json({ message: 'Faculty and associated user deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
};

module.exports = {
  addFaculty,
  getAllFaculty,
  getFacultyById,
  getMyFaculty,
  updateFaculty,
  deleteFaculty,
};
