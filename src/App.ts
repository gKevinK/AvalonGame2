import * as express from 'express';
import * as socketio from 'socket.io';
import UserManager from './server/UserManage';
import RoomManager from './server/RoomManage';
import { IStatus, IJoinNew, IUserInfo, IJoin } from './common/RoomInterface';

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

    let userid: string | undefined = undefined;

    let cb = (type: string, obj: any) => {
        if (type === 'join') {
            let u = getUser();
            if (u) u.roomid = obj.roomid;
        } else if (type === 'exit') {
            let u = getUser();
            if (u) u.roomid = undefined;
        }
        socket.emit(type, obj);
    };

    function getUser() {
        return userm.Get(userid || '');
    };

    function getRoom() {
        let rid = getRoomId();
        return rid ? roomm.GetRoom(rid) : undefined;
    };

    function getRoomId() {
        if (!userid) return undefined;
        let u = userm.Get(userid);
        if (!u) return undefined;
        return u.roomid;
    };
    
    socket.on('get-status', function (token: string) {
        let res: IStatus = {};
        let u = userm.GetByToken(token);
        if (u) {
            userid = u.id;
            res.user = u;
            if (u.roomid) {
                let room = getRoom();
                res.room = room ? room.GetStatus(u.id) : undefined;
            }
        }
        socket.emit('status', res);
    });

    socket.on('user-info', function (data: string) {
        // let name = <IUserInfo>JSON.parse(data);
        let name = JSON.parse(data);
        if (name.length < 4 || name.length > 12) return;
        if (userid) {
            let u = getUser();
            if (u) {
                u.name = name;
                socket.emit('user-status', { id: u.id, name: u.name, token: u.token });
            }
        } else {
            let u = userm.NewUser(name);
            userm.NewToken(u);
            userid = u.id;
            socket.emit('user-status', { id: u.id, name: u.name, token: u.token });
        }
    });

    socket.on('join-new', function (data: string) {
        let u = getUser();
        if (!u) return;
        let obj = <IJoinNew>JSON.parse(data);
        let r = roomm.JoinNew(obj.conf, -1, { userid: u.id, name: u.name }, cb);
        if (r == false) {
            socket.emit('err');
        }
    });

    socket.on('join', function (data) {
        let u = getUser();
        if (!u) return;
        let obj = <IJoin>JSON.parse(data);
        let r = roomm.Join(obj.roomid, -1, { userid: u.id, name: u.name }, cb);
        if (r == false) {
            socket.emit('err');
        }
    });

    socket.on('room', function (data) {
        // TODO
        if (userid === undefined) return;
    });

    socket.on('operate', function (data: string) {
        // TODO
        let r = getRoom();
        if (r) r.Operate(<string>userid, data);
    });

    socket.on('msg', function (data: string) {
        let r = getRoom();
        if (r) r.Message(<string>userid, data);
    });

    socket.on('disconnect', function () {
        let u = getUser();
        if (u && u.roomid) {
            roomm.Disconnect(u.id, u.roomid);
        }
    });
});

var PORT = 3000;

server.listen(PORT, function () {
    console.log('Listening on port ' + PORT.toString() + '...');
});
