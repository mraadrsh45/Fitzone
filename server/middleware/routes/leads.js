const express = require('express');
const router  = express.Router();
const { createLead, getAllLeads, updateLeadStatus, deleteLead, bulkCreateLeads } = require('../controllers/leadController');
const { protect } = require('../middleware/auth');

router.post('/create',   createLead);            // Public — landing page form
router.post('/bulk',     protect, bulkCreateLeads);
router.get('/all',       protect, getAllLeads);   // ?status=new&search=...
router.put('/:id',       protect, updateLeadStatus);
router.delete('/:id',    protect, deleteLead);

module.exports = router;
