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

    let room_id: string = undefined;
    let order: number = undefined;

    let callback: (t: string, o: any) => void = (t, o) => {
        switch (t) {
            case 'exit':
                room_id = undefined;
                order = undefined;
                break;
            case 'join':
                room_id = o.room_id;
                order = o.order;
                break;
        }
        socket.emit(t, JSON.stringify(o));
    };

    socket.on('join-new', function (data: string) {
        let obj = JSON.parse(data);
        let r = roomm.JoinNew(obj.player_num, obj.order, obj.name, callback);
        if (r == false) {
            socket.emit('err');
        }
    });

    socket.on('join', function (data) {
        let obj = JSON.parse(data);
        let r = roomm.Join(obj.room_id, obj.order, obj.name, callback);
        if (r == false) {
            socket.emit('err');
        }
    });

    // socket.on('reconn', function (data) {
    //     // TODO
    // });

    socket.on('operate', function (data: string) {
        if (room_id == undefined || roomm.GetRoom(room_id) == undefined) return;
        roomm.GetRoom(room_id).operate(order, data);
    });

    socket.on('msg', function (data) {
        if (room_id == undefined || roomm.GetRoom(room_id) == undefined) return;
        roomm.GetRoom(room_id).message(order, data);
    });

    socket.on('disconnect', function () {
        if (room_id != undefined)
            roomm.Exit(room_id, order);
    });
});

server.listen(3000, function () {
    console.log('Listening on port 3000...');
});
