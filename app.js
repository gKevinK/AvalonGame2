const express = require('express');
const session = require('express-session');
const socketio = require('socket.io');

const app = express();
const server = require('http').Server(app);
const io = socketio(server);
app.use('/static', express.static('public'));
app.use(session({ secret : 's3Cur3', name : 'sessionId', }));

const rooms = {};
const users = {};

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/game', function (req, res) {
  res.sendFile(__dirname + '/view/game.html');
});

io.on('connection', function (socket) {
  // TODO

  socket.on('login', function (data) {
    // TODO
  });

  socket.on('msg', function (data) {
    // TODO
  });

  socket.on('disconnect', function () {
    // TODO
  });
});

app.listen(3000, function () {
  console.log('Listening on port 3000...');
});
