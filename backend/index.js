const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ให้ Express ให้บริการไฟล์จากโฟลเดอร์ 'frontend'
app.use(express.static(path.join(__dirname, '../frontend'))); // เปลี่ยนเส้นทางไปยัง 'frontend'

// Routing: ให้บริการหน้าแรก (HTML)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html')); // ส่งไฟล์ index.html จากโฟลเดอร์ 'frontend'
});

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('join', (username) => {
    console.log(`${username} joined the chat`);
  });

  socket.on('chat message', (data) => {
    io.emit('chat message', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});