const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = require('http').Server(app);
const io = socketio(server);
app.use('/static', express.static('public'));

const rooms = {};
const users = {};

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', function (socket) {
    // TODO

    socket.on('join', function (data) {
        // TODO
    });

    socket.on('operate', function (data) {
        // TODO
    });

    socket.on('msg', function (data) {
        // TODO
    });

    socket.on('disconnect', function () {
        // TODO
    });
});

app.listen(3000, function () {
    console.log('Listening on port 3000...');
});
