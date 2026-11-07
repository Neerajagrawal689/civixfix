const express = require('express');
const { getNotices, createNotice, deleteNotice } = require('../controllers/notice.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', getNotices);
router.post('/', requireAuth, requireRole(['ADMIN', 'OFFICER']), createNotice);
router.delete('/:id', requireAuth, requireRole(['ADMIN', 'OFFICER']), deleteNotice);

module.exports = router;
