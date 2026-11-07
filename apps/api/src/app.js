const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'CivicFix API is running' });
});

// Base API router
// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const apiRouter = express.Router();

// Mount routes here
apiRouter.use('/auth', require('./routes/auth.routes'));
apiRouter.use('/issues', require('./routes/issue.routes'));
apiRouter.use('/notices', require('./routes/notice.routes'));
apiRouter.use('/lost-and-found', require('./routes/lostAndFound.routes'));
apiRouter.use('/polls', require('./routes/poll.routes'));

app.use('/api/v1', apiRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred',
    },
  });
});

module.exports = app;
