const express = require('express');
const { createIssue, getIssues, getIssueById, getAllPublicIssues, updateIssueStatus, getComments, addComment, toggleSupport, getSupportStatus, assignIssue, getFeedback, submitFeedback } = require('../controllers/issue.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

// Public route for global map (does not require auth)
router.get('/map', getAllPublicIssues);

router.use(requireAuth);

// Apply multer middleware to POST / route
router.post('/', upload.single('image'), createIssue);
router.get('/', getIssues);
router.get('/:id', getIssueById);
router.patch('/:id/status', upload.single('image'), updateIssueStatus);

router.get('/:id/comments', getComments);
router.post('/:id/comments', addComment);

router.get('/:id/support', getSupportStatus);
router.get('/:id/support-status', getSupportStatus);
router.post('/:id/support', toggleSupport);
router.post('/:id/assign', assignIssue);

router.get('/:id/feedback', getFeedback);
router.post('/:id/feedback', submitFeedback);

module.exports = router;
