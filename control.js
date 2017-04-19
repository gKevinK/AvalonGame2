const AvalonCore = require('./avalon-core');

class User {
  constructor(user_id, room_id, order, name) {
    this.user_id = user_id;
    this.room_id = room_id;
    this.order = order
    this.name = name;
  }
}

class Seat {

  constructor() {
    this.history_msg = [];
  }

  get status() {
    // TODO
    return this.socket != undefined;
  }

  canOccupy(user_id) {
    if (this.socket) {
      return false;
    }
  }

  occupy(socket, user_id, clearUserCallback) {
    this.socket = socket;
    this.user_id = user_id;
  }

  release() {
    this.socket = undefined;
    // this.user_id = undefined;
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
    this.seats = [];
    for (var i = 0; i < player_num; i++) {
      this.seats.push(new Seat());
    }
    this.core = new AvalonCore(player_num, (args) => { this.notify(args); });
    console.log('Room ' + room_id + ' created, player num: ' + player_num + '.');
  }

  join(socket, name = '', user_id, order = null) {
    if (!Number.isInteger(order) || order < 0 || order > this.player_num || name.length < 4) {
      return '请求错误。';
    } else if (order === 0) {
      var try_order = random_range(this.player_num);
      for (var o of try_order) {
        if (this.seats[o].canOccupy(user_id)) {
          this.seats[o].occupy(socket, user_id);
          return o;
        }
      }
      return '房间已满。';
    } else {
      var o = order - 1;
      if (this.seats[o].canOccupy(user_id)) {
        this.seats[o].occupy(socket, user_id);
        return o;
      } else {
        return '此位置已被占用。';
      }
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
    for (var seat in this.seats) {
      if (seat) {
        seat.message(JSON.stringify({
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
      this.seats[i].nofity(notify_args.msg);
    }
  }

  exit(user_id) {
    this.users.get(user_id).status = -1;
    console.log('Room ' + this.room_id + ', user ' + name + ' exit.');
    for (var seat of this.seats) {
      if (seat.status == 0) {
        return false;
      }
    }
    for (var seat of this.seats) {
      seat.release();
    }
    return true;
  }
}

module.exports = RoomCtrl;
module.exports.User = User;
