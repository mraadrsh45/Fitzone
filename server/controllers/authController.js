const User = require('../models/User');

const safeUser = (user) => ({
  id:         user._id,
  name:       user.name,
  email:      user.email,
  gymName:    user.gymName,
  avatar_url: user.avatar_url,
  phone:      user.phone,
  location:   user.location,
});

// @desc    Upsert user profile after Firebase auth
// @route   POST /api/auth/upsert
const upsertUser = async (req, res) => {
  try {
    const { email, name, gymName, avatar_url } = req.body;
    
    // Safety check: ensure email matches the token email
    if (req.firebaseUser && req.firebaseUser.email !== email) {
      return res.status(403).json({ success: false, message: 'Token email mismatch' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user record
      user = await User.create({ 
        email, 
        name: name || email.split('@')[0], 
        gymName: gymName || '', 
        avatar_url: avatar_url || '' 
      });
    } else {
      // Optionally update name/avatar if provided from Google Sign-In
      const updates = {};
      if (name && !user.name) updates.name = name;
      if (avatar_url && !user.avatar_url) updates.avatar_url = avatar_url;
      
      if (Object.keys(updates).length > 0) {
        user = await User.findByIdAndUpdate(user._id, updates, { new: true });
      }
    }

    res.status(200).json({ success: true, user: safeUser(user) });
  } catch (error) {
    console.error('Upsert User Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  res.status(200).json({ success: true, user: safeUser(req.user) });
};

// @desc    Update profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { name, gymName, avatar_url, phone, location } = req.body;
    const updates = {};
    if (name       !== undefined) updates.name       = name;
    if (gymName    !== undefined) updates.gymName    = gymName;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;
    if (phone      !== undefined) updates.phone      = phone;
    if (location   !== undefined) updates.location   = location;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.status(200).json({ success: true, user: safeUser(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { upsertUser, getMe, updateProfile };
