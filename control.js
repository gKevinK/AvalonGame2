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
    } else {
      return true;
    }
  }

  occupy(socket, user_id, clearUserCallback) {
    this.socket = socket;
    this.user_id = user_id;
  }

  leave() {
    this.socket = undefined;
  }

  release() {
    this.socket = undefined;
    return this.user_id;
  }

  message(json) {
    if (this.socket) {
      this.socket.emit('msg', json);
    }
    this.history_msg.push(json);
  }

  notify(json) {
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
      order = -1;
      var try_order = random_range(this.player_num);
      for (var o of try_order) {
        if (this.seats[o].canOccupy(user_id)) {
          order = o;
          break;
        }
      }
      if (order === -1) {
        return '房间已满。';
      }
    } else {
      var o = order - 1;
      if (this.seats[o].canOccupy(user_id)) {
        order = o;
      } else {
        return '此位置已被占用。';
      }
    }
    for (var seat of this.seats) {
      seat.notify(JSON.stringify({ event: 'join', order: o + 1, name: name }));
    }
    this.seats[order].occupy(socket, user_id);
    return order;
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
    var result = this.core.operate(0, op);
    if (result === false) {

    }
    //
  }

  _get_user(user_id) {

  }

  notify(notify_args) {
    for (var i in notify_args.players) {
      this.seats[i].nofity(notify_args.msg);
    }
  }

  exit(order) {
    this.seats[order].leave();
    for (var seat in this.seats) {
      seat.notify(JSON.stringify({ event: 'exit', order: order + 1 }));
    }
    console.log('Room ' + this.room_id + ', user ' + name + ' exit.');
    for (var seat of this.seats) {
      if (seat.status == 0) {
        return false;
      }
    }
    for (var seat of this.seats) {
      var user_id = seat.release();
      this.users.delete(user_id);
    }
    return true;
  }
}

module.exports = RoomCtrl;
module.exports.User = User;
