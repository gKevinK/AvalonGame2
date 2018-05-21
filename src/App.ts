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

    let room_id: string = null;
    let order: number = null;

    let callback: (t: string, o: any) => void = (t, o) => {
        switch (t) {
            case 'exit':
                room_id = null;
                order = null;
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
        let r = roomm.Join(obj.player_num, obj.order, obj.name, callback);
        if (r == false) {
            socket.emit('err');
        }
    });

    // socket.on('reconn', function (data) {
    //     // TODO
    // });

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
