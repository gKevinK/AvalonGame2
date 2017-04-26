const AvalonMachine = require('./avalon-core');
const Util = require('./util.js');

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
    return (this.socket != undefined) ? 0 : -1;
  }

  canOccupy(user_id) {
    return (this.socket == undefined);
  }

  occupy(socket, user_id, clearUserCallback) {
    this.socket = socket;
    this.user_id = user_id;
  }

  leave() {
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

class RoomCtrl {

  constructor(room_id, users, player_num) {
    this.room_id = room_id;
    this.player_num = player_num;
    this.users = users;
    this.seats = [];
    for (var i = 0; i < player_num; i++) {
      this.seats.push(new Seat());
    }
    this.machine = new AvalonMachine(player_num, (args) => { this.notify(args); });
    console.log('Room ' + room_id + ' created, player num: ' + player_num + '.');
  }

  join(socket, name = '', user_id, order = null) {
    if (!Number.isInteger(order) || order < 0 || order > this.player_num || name.length < 4) {
      return '请求错误。';
    } else if (order === 0) {
      order = -1;
      var try_order = Util.randomRange(this.player_num);
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
    this.seats.map(function(seat) {
      seat.notify(JSON.stringify({ event: 'join', order: o + 1, name: name }));
    });
    this.seats[order].occupy(socket, user_id);
    console.log('Room ' + this.room_id + ', player ' + order + ' ' + name + ' joined.');
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

  message(order, text) {
    for (var seat of this.seats) {
      if (seat) {
        seat.message(JSON.stringify({
          player_order: order + 1, text: text,
        }));
      }
    }
  }

  operate(order, json) {
    var op = JSON.parse(json);
    var result = this.machine.operate(order, op);
    if (result === false) {
      this.seats[order].notify('error');
    }
    //
  }

  notify(notify_args) {
    if (notify_args.players.length == 0) {
      this.seats.map(function (seat) { seat.notify(notify_args.msg); });
    } else {
      for (var i in notify_args.players) {
        this.seats[i].notify(notify_args.msg);
      }
    }
  }

  exit(order) {
    this.seats[order].leave();
    for (var seat of this.seats) {
      seat.notify(JSON.stringify({ event: 'exit', order: order + 1 }));
    }
    console.log('Room ' + this.room_id + ', player ' + order + ' exit.');
    for (var seat of this.seats) {
      if (seat.status == 0) {
        return false;
      }
    }
    for (var seat of this.seats) {
      var user_id = seat.leave();
      this.users.delete(user_id);
    }
    return true;
  }
}

module.exports = RoomCtrl;
module.exports.User = User;
