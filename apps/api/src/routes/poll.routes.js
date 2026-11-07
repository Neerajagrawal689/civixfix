const express = require('express');
const { getPolls, createPoll, voteOnPoll, closePoll } = require('../controllers/poll.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', requireAuth, getPolls);
router.post('/', requireAuth, requireRole(['ADMIN', 'OFFICER']), createPoll);
router.post('/:id/vote', requireAuth, voteOnPoll);
router.patch('/:id/close', requireAuth, requireRole(['ADMIN', 'OFFICER']), closePoll);

module.exports = router;
