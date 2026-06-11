const Lead = require('../models/Lead');

// @desc    Create lead
// @route   POST /api/leads/create
const createLead = async (req, res) => {
  try {
    const { customer_name, email, phone, fitness_goal, membership_interest, source, user_id } = req.body;
    if (!customer_name || !email || !phone || !fitness_goal)
      return res.status(400).json({ success: false, message: 'Please fill all required fields' });

    const lead = await Lead.create({ customer_name, email, phone, fitness_goal, membership_interest, source, user_id });
    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all leads (optional: filter by status / search)
// @route   GET /api/leads/all?status=new&search=john
const getAllLeads = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = { user_id: req.user._id };

    if (status && status !== 'all') filter.status = status;

    if (search) {
      const re = new RegExp(search, 'i');
      filter.$or = [
        { customer_name: re },
        { email: re },
        { phone: re },
      ];
    }

    const leads = await Lead.find(filter).sort({ created_at: -1 });
    res.status(200).json({ success: true, count: leads.length, data: leads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
const updateLeadStatus = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.status(200).json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Bulk create leads
// @route   POST /api/leads/bulk
const bulkCreateLeads = async (req, res) => {
  try {
    const { leads } = req.body;
    if (!Array.isArray(leads) || leads.length === 0) {
      return res.status(400).json({ success: false, message: 'No leads provided' });
    }

    const leadsToInsert = leads.map(lead => ({
      customer_name: lead.customer_name || 'Unknown',
      email: lead.email || '',
      phone: lead.phone || '',
      fitness_goal: lead.fitness_goal || 'General Fitness',
      membership_interest: lead.membership_interest || 'basic',
      source: lead.source || 'Import',
      status: lead.status || 'new',
      user_id: req.user._id
    }));

    const insertedLeads = await Lead.insertMany(leadsToInsert);
    res.status(201).json({ success: true, count: insertedLeads.length, data: insertedLeads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createLead, getAllLeads, updateLeadStatus, deleteLead, bulkCreateLeads };
