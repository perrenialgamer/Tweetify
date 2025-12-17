import { io } from 'socket.io-client';
import { SOCKET_URL as BASE_URL } from './helper.js';

const URL = `${BASE_URL}`;

const socket = io(URL);

// Join a chat
export const joinChat = (roomId, username) => {
     socket.emit('joinRoom', { roomId, username });
     console.log(`Joined room: ${roomId} as ${username}`);
 };
 
 // Leave a chat
 export const leaveChat = (roomId, username) => {
     socket.emit('leaveRoom', { roomId, username });
     console.log(`Left room: ${roomId}`);
 };
 
 // Send a message
 export const sendMessage = (roomId, message, username) => {
     const payload = {
         roomId,
         message,
         username,
         timestamp: new Date().toISOString(),
     };
     socket.emit('sendMessage', payload);
     console.log(`Message sent to room ${roomId}: "${message}"`);
 };
 
 export const listenForMessages = (callback) => {
     socket.off('receiveMessage'); // Remove existing listener
     socket.on('receiveMessage', (messageData) => {
       callback(messageData);
     });
   };
   