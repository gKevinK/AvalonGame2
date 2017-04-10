const AvalonCore = require('./avalon-core').AvalonCore;

class User {
    constructor (socket, name) {
        this.socket = socket;
        this.name = name;
    }
}

class RoomCtrl {

    constructor (player_num) {
        this.player_num = player_num;
        this.players = [];
        this.players.length = player_num;
        this.id_to_order = [];
        this.core = new AvalonCore(player_num);
    }

    add_user (user, order = null) {

    }

    msg (user_id, json) {

    }

    operate (user_id, json) {

    }

    _get_order (user_id) {

    }

    remove_user (user_id) {

    }
}

exports.RoomCtrl = RoomCtrl;
exports.User = User;
