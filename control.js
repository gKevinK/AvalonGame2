const AvalonCore = require('./avalon-core').AvalonCore;

class User {
    constructor (socket, name) {
        this.socket = socket;
        this.name = name;
    }

    message(json) {
        this.socket.emit('msg', json);
    } 
}

class RoomCtrl {

    constructor(room_id, player_num) {
        this.room_id = room_id;
        this.player_num = player_num;
        this.users = [];
        this.users.length = player_num;
        this.id_to_order = new Map();
        this.core = new AvalonCore(player_num);
        console.log('Room ' + room_id + 'established, player num: ' + player_num);
    }

    join(socket, user_id, order = null) {

    }

    message(user_id, text) {
        var order = this.id_to_order.get(user_id);
        for (var user in this.users) {
            if (user) {
                user.message(JSON.stringify({
                    player_order: order + 1, text: text,
                }));
            }
        }
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
