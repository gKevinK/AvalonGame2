const AvalonCore = require('./avalon-core').AvalonCore;

class User {
    constructor (socket, name) {
        this.socket = socket;
        this.name = name;
    }
}

class RoomCtrl {

    constructor(room_id, player_num) {
        this.room_id = room_id;
        this.player_num = player_num;
        this.players = [];
        this.players.length = player_num;
        this.id_to_order = [];
        this.core = new AvalonCore(player_num);
        console.log('Room ' + room_id + 'established, player num: ' + player_num);
    }

    join(socket, user_id, order = null) {

    }

    message(user_id, json) {

    }

    operate(user_id, json) {

    }

    _get_order(user_id) {

    }

    exit(user_id) {

    }
}

exports.RoomCtrl = RoomCtrl;
exports.User = User;
