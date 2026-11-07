const express = require('express');
const { register, login, me, updateProfile, updatePassword, getWorkers } = require('../controllers/auth.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', requireAuth, me);
router.get('/workers', requireAuth, requireRole(['ADMIN', 'OFFICER']), getWorkers);
router.patch('/profile', requireAuth, upload.single('avatar'), updateProfile);
router.patch('/password', requireAuth, updatePassword);

module.exports = router;
