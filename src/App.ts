import * as express from 'express';
import * as socketio from 'socket.io';
import UserManager from './UserManage';
import RoomManager from './RoomManage';

const app = express();
const server = require('http').createServer(app);
const io = socketio(server);
app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/../static'));

var userm = new UserManager();
var roomm = new RoomManager();

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/../static/index.html');
});

io.on('connection', function (socket) {

    let user_id = undefined;

    socket.on('join-new', function (data: string) {
        let obj = JSON.parse(data);
        // obj.name;
    });

    socket.on('join', function (data) {
        if (user_id === undefined) return;

    });

    socket.on('reconn', function (data) {
        // TODO
    });

    socket.on('operate', function (data: string) {
        
    });

    socket.on('msg', function (data) {

    });

    socket.on('disconnect', function () {

    });
});

server.listen(3000, function () {
    console.log('Listening on port 3000...');
});
