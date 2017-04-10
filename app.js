const express = require('express');
const socketio = require('socket.io');
const control = require('./control');

const app = express();
const server = require('http').Server(app);
const io = socketio(server);
app.use('/static', express.static('public'));

const rooms = new Map();
const users = new Map();

function new_player_id () {
    var id = '';
    while (id.length < 100) {
        id += Math.random().toString(36).substr(2);
    }
    while (users.has(id)) {
        while (id.length < 100) {
            id += Math.random().toString(36).substr(2);
        }
    }
    return id;
}

function new_room_id () {
    var id = Math.floor(Math.random() * 9000 + 1000);
    while (rooms.has(id)) {
        id = Math.floor(Math.random() * 9000 + 1000);
    }
    return id;
}

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', function (socket) {

    socket.on('join', function (data) {
        var datajson = JSON.parse(data);
        // TODO
        if (/* Autheticate failed */false) {
            socket.emit('error', JSON.stringify({
                msg: 'Join failed',
            }));
        }
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
