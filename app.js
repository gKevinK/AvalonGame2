const express = require('express');
const socketio = require('socket.io');
const RoomCtrl = require('./control');

const app = express();
const server = require('http').Server(app);
const io = socketio(server);
app.use('/static', express.static('public'));

const rooms = new Map();
const users = new Map();

function new_user_id() {
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

function new_room_id() {
  var id = Math.floor(Math.random() * 9000 + 1000);
  while (rooms.has(id)) {
    id = Math.floor(Math.random() * 9000 + 1000);
  }
  return id.toString();
}

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', function (socket) {

  socket.on('join', function (data) {
    var dataObj = JSON.parse(data);
    var room_id = dataObj.room_id;
    var user_id = new_user_id();
    var name = dataObj.name;
    if (room_id === undefined) {
      room_id = new_room_id();
      // if (!Number.isInteger(dataObj.player_num)) {
      //   socket.emit('error');
      // }
      var room = new RoomCtrl(room_id, dataObj.player_num, users);
      rooms.set(room_id, room);
    }
    if (!rooms.has(room_id)) {
      socket.emit('error', '该房间不存在。');
      socket.disconnect();
    }
    var res = rooms[room_id].join(socket, name, user_id, dataObj.order);
    if (res instanceof string) {
      socket.emit('error', res);
      socket.disconnect();
      if (room_id != dataObj.room_id) {
        rooms.delete(room_id);
      }
    } else {
      socket.user_id = user_id;
      this.users.set(user_id, new User(socket, user_id, this.room_id, name));
      socket.emit('join', JSON.stringify({
        user_id: user_id, room_id: room_id,
      }));
    }
  });

  socket.on('reconn', function (data) {
    var dataObj = JSON.parse(data);
    if (users.has(dataObj.user_id)) {
      let room_id = users.get(dataObj.user_id).room_id;
      rooms.get(room_id).reconnect(socket, user_id);
    } else {
      socket.emit('error', 'clear cache!');
      socket.disconnect();
    }
  });

  socket.on('operate', function (data) {
    var room_id = users.get(socket.user_id).room_id;
    rooms.get(room_id).operate(socket.user_id, data);
  });

  socket.on('msg', function (data) {
    var room_id = users.get(socket.user_id).room_id;
    rooms.get(room_id).message(socket.user_id, data);
  });

  socket.on('disconnect', function () {
    var room_id = users.get(socket.user_id).room_id;
    if (room_id && rooms.has(room_id)) {
      var should_del = rooms.get(room_id).exit(socket.user_id);
      if (should_del) {
        rooms.delete(socket.room_id);
      }
    }
  });
});

app.listen(3000, function () {
  console.log('Listening on port 3000...');
});
