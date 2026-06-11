const mongoose = require('mongoose');

const gymSchema = new mongoose.Schema({
  gymName: { type: String, required: true },
  location: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  services: [{ type: String }],
  pricing: {
    basic: { type: Number, default: 999 },
    pro: { type: Number, default: 2499 },
    elite: { type: Number, default: 7999 },
  },
  phone: { type: String },
  email: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Gym', gymSchema);
