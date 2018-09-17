import * as express from 'express';
import * as socketio from 'socket.io';
import UserManager from './server/UserManage';
import RoomManager from './server/RoomManage';
import { IStatus } from './common/Interface';

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

    function getRoom() {
        if (userid === undefined) return undefined;
        return roomm.GetRoom(userm.Get(userid).roomid);
    }
    
    socket.on('get-status', function (data: string) {
        let user = userm.GetOrNew(data);
        userid = user.id;
        let res = <IStatus>{ user: user };
        if (user.roomid)
            res.room = getRoom().GetStatus(user.id);
        socket.emit('status', res);
    });

    socket.on('user-info', function (data: string) {
        // TODO
        if (userid === undefined) return;
    });

    socket.on('join-new', function (data: string) {
        if (userid === undefined) return;
        let obj = JSON.parse(data);
        // let r = roomm.JoinNew();
        // if (r == false) {
        //     socket.emit('err');
        // }
    });

    socket.on('join', function (data) {
        if (userid === undefined) return;
        let obj = JSON.parse(data);
        // let r = roomm.Join();
        // if (r == false) {
        //     socket.emit('err');
        // }
    });

    socket.on('room-op', function (data) {
        // TODO
        if (userid === undefined) return;
    });

    socket.on('operate', function (data: string) {
        // TODO
        if (userid === undefined) return;
    });

    socket.on('msg', function (data: string) {
        // TODO
        if (userid === undefined) return;

    });

    socket.on('disconnect', function () {
        if (userid === undefined) return;
        roomm.Disconnect(userid);
    });
});

var PORT = 3000;

server.listen(PORT, function () {
    console.log('Listening on port ' + PORT.toString() + '...');
});
