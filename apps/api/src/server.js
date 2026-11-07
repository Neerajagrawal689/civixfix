require('dotenv').config();
const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // For dev, allow all. Should be restricted in prod.
    methods: ['GET', 'POST', 'PATCH']
  }
});

// Bind io to the app so controllers can access it
app.set('io', io);

io.on('connection', (socket) => {
  console.log(`[Socket] User connected: ${socket.id}`);
  
  socket.on('join_issue', (issueId) => {
    socket.join(`issue_${issueId}`);
    console.log(`[Socket] User joined issue room: ${issueId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`[Server] API running on port ${PORT}`);
});
