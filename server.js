const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

let users = [];

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('userJoined', (name) => {
    console.log('User joined:', name);
    const newUser = {
      id: socket.id,
      name: name
    };
    
    users = users.filter(u => u.id !== socket.id);
    users.push(newUser);
    
    console.log('Current users:', users);
    setTimeout(() => {
      io.emit('updateUsers', users);
    }, 100);
  });

  socket.on('buzz', (name) => {
    console.log('Buzz from:', name);
    io.emit('buzzerClicked', name);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    users = users.filter(u => u.id !== socket.id);
    io.emit('updateUsers', users);
    console.log('Remaining users:', users);
  });
});

const PORT = 3001;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});