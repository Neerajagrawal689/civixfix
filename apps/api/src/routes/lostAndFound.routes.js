const express = require('express');
const { getAllItems, createItem, updateStatus, deleteItem } = require('../controllers/lostAndFound.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', getAllItems);
router.post('/', requireAuth, createItem);
router.patch('/:id/status', requireAuth, updateStatus);
router.delete('/:id', requireAuth, deleteItem);

module.exports = router;
