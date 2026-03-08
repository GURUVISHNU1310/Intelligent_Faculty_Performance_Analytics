const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  profilePhoto: {
    type: String,
    trim: true,
    default: '',
  },
  facultyId: {
    type: String,
    trim: true,
    default: '',
  },
  dateOfBirth: {
    type: Date,
    default: null,
  },
  gender: {
    type: String,
    trim: true,
    enum: ['Male', 'Female', 'Other', ''],
    default: '',
  },
  contactNumber: {
    type: String,
    trim: true,
    default: '',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  address: {
    type: String,
    trim: true,
    default: '',
  },
  designation: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  joiningDate: {
    type: Date,
    default: null,
  },
  experience: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Faculty', facultySchema);
