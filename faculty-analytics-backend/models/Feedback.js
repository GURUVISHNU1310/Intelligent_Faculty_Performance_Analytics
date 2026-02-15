const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
}, { timestamps: true });

// One feedback per student per faculty (latest overwrites or we allow one - using findOneAndUpdate with upsert)
feedbackSchema.index({ userId: 1, facultyId: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
