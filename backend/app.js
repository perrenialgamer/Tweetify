import express from 'express';
import { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import connectDB from './db/index.js';
import userRouter from './routes/user.routes.js';

// Initialize environment variables
dotenv.config({
  path: './.env',
});

// Create Express application
const app = express();

// Middleware for CORS, parsing, and cookies
app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json({
  limit: '16kb',
}));
app.use(urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

// Set up global headers
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  next();
});

// API routes
app.use('/api/v1/users', userRouter);

// Create HTTP server
const server = http.createServer(app);

// Set up Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  },
});

const onlineUsers = {}; // Track online users by room
// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  

  // Join a room
  socket.on('joinRoom', ({ roomId, username }) => {
    socket.join(roomId);
    if (!onlineUsers[roomId]) onlineUsers[roomId] = [];
    onlineUsers[roomId].push({ username, id: socket.id });
    console.log(onlineUsers[roomId]);
    console.log(`${username} joined room: ${roomId}`);

    

    const joinMessage = {
      author: 'System',
      message: `${username} has joined the room.`,
      timestamp: new Date().toISOString(),
    };
    io.to(roomId).emit('receiveMessage', joinMessage);
  });

  // Leave a room
  socket.on('leaveRoom', ({ roomId, username }) => {
    socket.leave(roomId);
    if (onlineUsers[roomId]) {
      onlineUsers[roomId] = onlineUsers[roomId].filter((user) => user.id !== socket.id);

      // If no users remain in the room, delete the room from onlineUsers
      if (onlineUsers[roomId].length === 0) {
        delete onlineUsers[roomId];
      }
    }
    console.log(`${username} left room: ${roomId}`);

    const leaveMessage = {
      author: 'System',
      message: `${username} has left the room.`,
      timestamp: new Date().toISOString(),
    };
    io.to(roomId).emit('receiveMessage', leaveMessage);
  });

  // Handle messages
  socket.on('sendMessage', ({ roomId, message, username, timestamp }) => {
    const messageData = {
      author: username,
      message,
      timestamp,
    };

    io.to(roomId).emit('receiveMessage', messageData);
    console.log(`Message in room ${roomId}: "${message}" by ${username}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    for (const roomId in onlineUsers) {
      onlineUsers[roomId] = onlineUsers[roomId].filter(user => user.id !== socket.id);
      io.to(roomId).emit('onlineUsers', onlineUsers[roomId]); // Update users in the room
    }
    
    console.log('A user disconnected:', socket.id);
  });
});

// Database connection and server startup
const PORT = 8000;
connectDB()
  .then(() => {
    console.log('DB connected successfully');
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  });

// Handle unexpected errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please use a different port.`);
    process.exit(1);
  } else {
    console.error('Server error:', error);
    throw error;
  }
});