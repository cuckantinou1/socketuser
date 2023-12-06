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

    // Adicionar usuário apenas se não for 'Usuário Desconhecido', 'null' ou 'Operador'
    if (userId !== 'Operador' && userId !== 'Usuário Desconhecido' && userId !== 'null' && !usersOnline.includes(userId)) {
        usersOnline.push(userId);
    }

    // Atualize a lógica para emitir a lista de usuários
    let limitedUsersOnline = usersOnline.filter(user => user !== 'Operador' && user !== 'null').slice(0, 10);
    io.emit('user list', limitedUsersOnline);

    socket.on('disconnect', () => {
        usersOnline = usersOnline.filter(user => user !== userId);

        // Remover usuários 'null' na desconexão
        usersOnline = usersOnline.filter(user => user !== 'null');

        limitedUsersOnline = usersOnline.filter(user => user !== 'Operador' && user !=='null').slice(0, 10);
        io.emit('user list', limitedUsersOnline);
    });
});
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log('Servidor iniciado na porta ' + PORT);
});
