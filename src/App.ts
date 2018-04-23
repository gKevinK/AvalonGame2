import express = require('express');
import socketio = require('socket.io');
import UserManager from './UserManage';
import RoomManager from './RoomManage';

const app = express();
const server = require('http').createServer(app);
const io = socketio(server);
app.use('/static', express.static(__dirname + '/static'));

var userm = new UserManager();
var roomm = new RoomManager();

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/static/index.html');
});

io.on('connection', function (socket) {
    
    socket.on('join', function (data) {

    });

    socket.on('reconn', function (data) {

    });

    socket.on('operate', function (data) {

    });

    socket.on('msg', function (data) {

    });

    socket.on('disconnect', function () {

    });
});

server.listen(3000, function () {
    console.log('Listening on port 3000...');
});
