const express = require('express');
const socketio = require('socket.io');
const RoomCtrl = require('./control');
const User = RoomCtrl.User;

const app = express();
const server = require('http').createServer(app);
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
      socket.emit('err', '该房间不存在。');
      socket.disconnect();
    }
    var res = rooms.get(room_id).join(socket, name, user_id, dataObj.order);
    if (typeof(res) === 'string') {
      socket.emit('err', res);
      socket.disconnect();
      if (room_id != dataObj.room_id) {
        rooms.delete(room_id);
        console.log('Room ' + room_id + ' destroyed.');
      }
    } else {
      socket.user_id = user_id;
      users.set(user_id, new User(user_id, room_id, res, name));
      socket.emit('join', JSON.stringify({
        user_id: user_id, room_id: room_id, order: res + 1,
      }));
    }
  });

  socket.on('reconn', function (data) {
    var dataObj = JSON.parse(data);
    if (users.has(dataObj.user_id)) {
      var room_id = users.get(dataObj.user_id).room_id;
      rooms.get(room_id).reconnect(socket, user_id);
    } else {
      socket.emit('err', 'clear cache!');
      socket.disconnect();
    }
  });

  socket.on('operate', function (data) {
    try {
      var user = users.get(socket.user_id);
      rooms.get(user.room_id).operate(user.order, data);
    } catch (e) {
      console.log(e);
    }
  });

  socket.on('msg', function (data) {
    try {
      var user = users.get(socket.user_id);
      rooms.get(user.room_id).message(user.order, data);
    } catch (e) {
      console.log(e);
    }
  });

  socket.on('disconnect', function () {
    var user = users.get(socket.user_id);
    if (user && user.room_id && rooms.has(user.room_id)) {
      var should_del = rooms.get(user.room_id).exit(user.order);
      if (should_del) {
        rooms.delete(user.room_id);
        console.log('Room ' + user.room_id + ' destroyed.');
      }
    }
  });
});

server.listen(3000, function () {
  console.log('Listening on port 3000...');
});
