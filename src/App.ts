import * as express from 'express';
import * as socketio from 'socket.io';
import UserManager from './server/UserManage';
import RoomManager from './server/RoomManage';

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

    let userid: string = undefined;

    socket.on('join-new', function (data: string) {
        let obj = JSON.parse(data);
        // let r = roomm.JoinNew();
        // if (r == false) {
        //     socket.emit('err');
        // }
    });

    socket.on('join', function (data) {
        let obj = JSON.parse(data);
        // let r = roomm.Join();
        // if (r == false) {
        //     socket.emit('err');
        // }
    });

    socket.on('get-status', function (data) {
        // TODO
    });

    socket.on('operate', function (data: string) {
        // TODO
    });

    socket.on('msg', function (data) {
        // TODO
    });

    socket.on('disconnect', function () {
        // TODO
    });
});

var PORT = 3000;

server.listen(PORT, function () {
    console.log('Listening on port ' + PORT.toString() + '...');
});
