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

    // Não adicionar o usuário 'Operador' à lista
    if (userId !== 'Operador') {
        usersOnline.push(userId);
    }

    // Emitir lista limitada a 3 usuários, excluindo o usuário 'Operador'
    let limitedUsersOnline = usersOnline.filter(user => user !== 'Operador').slice(0, 3);
    io.emit('user list', limitedUsersOnline);

    socket.on('disconnect', () => {
        usersOnline = usersOnline.filter(user => user !== userId);
        // Emitir lista atualizada após a desconexão
        limitedUsersOnline = usersOnline.filter(user => user !== 'Operador').slice(0, 3);
        io.emit('user list', limitedUsersOnline);
    });
});


// Render.com sets the PORT environment variable for your app
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log('Servidor iniciado na porta ' + PORT);
});
