const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

// Serve the static files
app.use(express.static(__dirname + '/public'));

// Store connected users
const connectedUsers = {};

// Socket.io logic
io.on('connection', (socket) => {
  console.log('A user connected');

  //  user login
  socket.on('login', (username) => {
    console.log(`User ${username} logged in`);
    connectedUsers[username] = socket.id;
    io.emit('user-list', Object.keys(connectedUsers));
  });

  //  sending messages
  socket.on('send-message', (data) => {
    const { sender,senderName, recipient, message } = data;
    const recipientSocketId = connectedUsers[recipient];

    if (recipientSocketId) {
      io.to(recipientSocketId).emit('receive-message', {
        sender,
        senderName,
        message
      });
    }
  });

  //  user disconnection
  socket.on('disconnect', () => {
    const disconnectedUser = Object.keys(connectedUsers).find(
      (username) => connectedUsers[username] === socket.id
    );

    if (disconnectedUser) {
      console.log(`User ${disconnectedUser} disconnected`);
      delete connectedUsers[disconnectedUser];
      io.emit('user-list', Object.keys(connectedUsers));
    }
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
