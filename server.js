const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let usersOnline = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    let userId = socket.handshake.query.id || 'Usuário Desconhecido';
    usersOnline.push(userId);
    io.emit('user list', usersOnline);

    socket.on('disconnect', () => {
        usersOnline = usersOnline.filter(user => user !== userId);
        io.emit('user list', usersOnline);
    });
});

// Render.com sets the PORT environment variable for your app
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log('Servidor iniciado na porta ' + PORT);
});
