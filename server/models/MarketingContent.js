const mongoose = require('mongoose');

const marketingContentSchema = new mongoose.Schema({
  user_id:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content_type:  { type: String },   // 'caption','hashtags','adcopy', etc.
  content:       { type: String },
  gym_name:      { type: String },
  campaign_goal: { type: String },
  audience_type: { type: String },
  location:      { type: String },
  tone:          { type: String },
  is_saved:      { type: Boolean, default: false },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

marketingContentSchema.virtual('id').get(function () { return this._id.toHexString(); });
marketingContentSchema.set('toJSON',   { virtuals: true });
marketingContentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('MarketingContent', marketingContentSchema);
