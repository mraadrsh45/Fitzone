const express = require('express');
const router = express.Router();
const { createGym, getAllGyms } = require('../controllers/gymController');
const { protect } = require('../middleware/auth');

router.post('/create', protect, createGym);
router.get('/all', getAllGyms);

module.exports = router;
