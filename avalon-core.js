const config = {
    role : {
        5 : [0, 1, 2, 3, 4],
        6 : [0, 1, 2, 2, 3, 4],
        7 : [0, 1, 2, 2, 3, 4, 6],
        8 : [0, 1, 2, 2, 2, 3, 4, 7],
        9 : [0, 1, 2, 2, 2, 2, 3, 4, 5],
        10: [0, 1, 2, 2, 2, 2, 3, 4, 5, 6]
    },
    mission : {
        5 : [2, 3, 2, 3, 3],
        6 : [2, 3, 4, 3, 4],
        7 : [2, 3, 3, 4, 4],
        8 : [3, 4, 4, 5, 5],
        9 : [3, 4, 4, 5, 5],
        10: [3, 4, 4, 5, 5]
    },
}

class AvalonCore {
    constructor (player_num, notify_callback) {
        this.player_num = player_num;
        this.notify = notify_callback;
    }

    init () {
        // TODO
    }

    operate () {
        // TODO
    }

    exit () {
        // TODO
    }
}

module.exports = AvalonCore;
