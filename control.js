const AvalonCore = require('./avalon-core');

class User {
  constructor(socket, user_id, room_id, name) {
    this.socket = socket;
    this.user_id = user_id;
    this.room_id = room_id;
    this.name = name;
    this.status = 0;
    this.history_msg = [];
  }

  message(json) {
    if (this.socket) {
      this.socket.emit('msg', json);
    }
    this.history_msg.push(json);
  }

  nofity(json) {
    if (this.socket) {
      this.socket.emit('notify', json);
    }
  }
}

function range(n) {
  return [...Array(n).keys()];
}

function random_range(n) {
  var randarr = [];
  for (var i = 0; i < n; i++) {
    randarr.push(Math.random());
  }
  return range(n).sort(function (a, b) {
    return randarr[a] - randarr[b];
  });
}

class RoomCtrl {

  constructor(room_id, player_num, users) {
    this.room_id = room_id;
    this.player_num = player_num;
    this.users = users;
    this.ids = [];
    this.ids.length = player_num;
    this.core = new AvalonCore(player_num, (args) => { this.notify(args); });
    console.log('Room ' + room_id + ' created, player num: ' + player_num + '.');
  }

  join(socket, name = '', user_id, order = null) {
    if (!Number.isInteger(order) || order < 0 || order > this.player_num || name.length < 4) {
      return '请求错误。';
    } else if (order === 0) {
      var try_order = random_range(this.player_num);
      for (var o of try_order) {
        if (this.ids[o] == undefined || this.users.get(this.ids[o]).status != 0) {
          if (this.users.get(this.ids[o]) && this.users.get(this.ids[o]).status != 0) {
            this.users.delete(this.ids[o]);
          }
          this.ids[o] = user_id;
          return o;
        }
      }
      return '房间已满。';
    } else {
      var o = order - 1;
      if (this.ids[o] && this.users.get(this.ids[o])) {
        if (this.users.get(this.ids[o]).status != 0) {
          this.users.delete(this.ids[o]);
        } else {
          return '此位置已被占用。';
        }
      }
      this.ids[o] = user_id;
      return o;
    }
  }

  reconnect(socket, user_id) {
    user = this.users.get(user_id);
    user.status = 0;
    user.socket = socket;
    socket.emit('join', JSON.stringify({
      room_id: this.room_id, user_id: user_id,
    }));
  }

  message(user_id, text) {
    var order = this.ids.indexOf(user_id);
    for (var user in this.ids) {
      if (user) {
        user.message(JSON.stringify({
          player_order: order + 1, text: text,
        }));
      }
    }
  }

  operate(user_id, json) {
    var op = JSON.parse(json);

  }

  _get_user(user_id) {

  }

  notify(notify_args) {
    for (var i in notify_args.players) {
      // TODO: Notify
    }
  }

  exit(user_id) {
    this.users.get(user_id).status = -1;
    for (var id of this.ids) {
      if (this.users.get(id) && this.users.get(id).status == 0) {
        return false;
      }
    }
    for (var id of this.ids) {
      this.users.delete(id);
    }
    return true;
  }
}

module.exports = RoomCtrl;
module.exports.User = User;
