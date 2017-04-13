const express = require('express');
const socketio = require('socket.io');
const control = require('./control');

const app = express();
const server = require('http').Server(app);
const io = socketio(server);
app.use('/static', express.static('public'));

const rooms = new Map();

function new_user_id () {
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
        var room_id = datajson.room_id || 0;
        var user_id = new_user_id();
        if (!rooms.has(room_id)) {
            room_id = new_room_id();
            rooms.set(room_id, new RoomCtrl(room_id, datajson.player_num));
        }
        var order = rooms[room_id].join(socket, datajson.order);
        if (order >= 0) {
            socket.user_id = new_user_id();
            socket.room_id = room_id;
            socket.emit('join', JSON.stringify({
                room_id: room_id, order: order + 1,
            }));
        } else {
            socket.emit('error', 'Join failed.');
            socket.disconnect();
        }
    });

    socket.on('operate', function (data) {
        rooms.get(socket.room_id).operate(socket.user_id, data);
    });

    socket.on('msg', function (data) {
        rooms.get(socket.room_id).message(socket.user_id, data);
    });

    socket.on('disconnect', function () {
        var should_del = rooms.get(socket.room_id).exit(socket.user_id);
        if (should_del) {
            rooms.delete(socket.room_id);
        }
    });
});

app.listen(3000, function () {
    console.log('Listening on port 3000...');
});
