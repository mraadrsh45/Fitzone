const express = require('express');
const router  = express.Router();
const {
  generateCaption, generateHashtags, generateAdCopy, generateBlogIdeas, generateSEOKeywords,
  saveMarketingContent, getSavedContent, deleteContent,
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/caption',    protect, generateCaption);
router.post('/hashtags',   protect, generateHashtags);
router.post('/adcopy',     protect, generateAdCopy);
router.post('/blogideas',  protect, generateBlogIdeas);
router.post('/seokeywords',protect, generateSEOKeywords);

// Marketing content library
router.post('/save',       protect, saveMarketingContent);
router.get('/saved',       protect, getSavedContent);
router.delete('/saved/:id',protect, deleteContent);

module.exports = router;
