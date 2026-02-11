const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true,
  },
  teachingScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0,
  },
  studentFeedback: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0,
  },
  attendance: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0,
  },
  researchPapers: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0,
  },
  adminWork: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0,
  },
  totalScore: {
    type: Number,
    default: 0,
  },
  performanceLevel: {
    type: String,
    enum: ['Excellent', 'Very Good', 'Good', 'Needs Improvement'],
    default: 'Needs Improvement',
  },
}, { timestamps: true });

module.exports = mongoose.model('Performance', performanceSchema);
