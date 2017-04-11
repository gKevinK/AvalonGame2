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
        var result = -1;
        if (datajson.user_id) {
            // TODO
        } else if (rooms.has(datajson.room_id)) {
            var result = rooms[room_id].join(datajson.order);
        } else {
            room_id = new_room_id();
            rooms.set(room_id, new RoomCtrl(room_id, datajson.player_num));
            var result = rooms[room_id].join(datajson.order);
        }
        if (result >= 0) {
            socket.room_id = room_id;
            socket.order = order;
            socket.emit('join', JSON.stringify({
                room_id: room_id, order: result + 1,
            }))
        } else {
            socket.emit('error', 'Join failed.');
        }
    });

    socket.on('operate', function (data) {
        rooms.get(socket.room_id).operate(socket.user_id, data);
    });

    socket.on('msg', function (data) {
        rooms.get(socket.room_id).message(socket.user_id, data);
    });

    socket.on('disconnect', function () {
        rooms.get(socket.room_id).exit(socket.user_id);
    });
});

app.listen(3000, function () {
    console.log('Listening on port 3000...');
});
