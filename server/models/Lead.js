const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  customer_name: { type: String, required: true },
  email:         { type: String, required: true },
  phone:         { type: String, required: true },
  fitness_goal:  { type: String, required: true },
  membership_interest: { type: String, enum: ['basic', 'pro', 'elite'], default: 'basic' },
  source:  { type: String, default: 'Website' },
  status:  { type: String, enum: ['new', 'contacted', 'converted', 'lost'], default: 'new' },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

leadSchema.virtual('id').get(function () { return this._id.toHexString(); });
leadSchema.set('toJSON',   { virtuals: true });
leadSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Lead', leadSchema);
