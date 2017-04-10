const Status = {
    Idle: 0,
    Wait: 1,
    Play: 2,
};

const Role = {
    0: '梅林',
    1: '派西维尔',
    2: '忠臣',
    3: '刺客',
    4: '莫甘娜',
    5: '莫德雷德',
    6: '奥伯伦',
    7: '爪牙'
};

var Info = {
    role: '',
    role_name: 'unknown',
    player_id: '',
    player_num: '',
    known_player: [],

    current_status: Status.Idle,
    current_round: 0,
    current_try: 0,
    current_team: [],
    mission_player_num: []
}

var MsgVM = new Vue({
    el: '#msg-form',
    data: {
        message: '',
    },
    methods: {
        send: function () {
            socket.emit('msg', this.message);
            this.message = '';
        },
    }
});

var GameVM = new Vue({
    el: '#info-panel',
    data: {

    },
    methods: {
        vote: function () {

        },

    }
})

function dialogNotify(content) {
    alert(content);
};

document.onload = function () {

};

// socket = io();

// socket.on('connection', function (data) {
//     // TODO
// });

// socket.on('login', function (data) {
//     // TODO
// });

// socket.on('operate', function (data) {
//     // TODO
// });

// socket.on('msg', function (data) {
//     // TODO
// });
