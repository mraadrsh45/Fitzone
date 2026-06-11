const Gym = require('../models/Gym');

// @desc    Create gym
// @route   POST /api/gym/create
const createGym = async (req, res) => {
  try {
    const { gymName, location, services, pricing, phone, email, description } = req.body;
    const gym = await Gym.create({
      gymName,
      location,
      services,
      pricing,
      phone,
      email,
      description,
      owner: req.user._id,
    });
    res.status(201).json({ success: true, data: gym });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all gyms
// @route   GET /api/gym/all
const getAllGyms = async (req, res) => {
  try {
    const gyms = await Gym.find().populate('owner', 'name email');
    res.status(200).json({ success: true, count: gyms.length, data: gyms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createGym, getAllGyms };
