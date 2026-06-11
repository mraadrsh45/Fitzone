const express = require('express');
const router  = express.Router();
const { upsertUser, getMe, updateProfile } = require('../controllers/authController');
const { protect, verifyTokenOnly } = require('../middleware/auth');

router.post('/upsert', verifyTokenOnly, upsertUser);
router.get('/me',      protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
