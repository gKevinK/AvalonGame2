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

Vue.component('player', {
    template: '\
        <li>\
            {{ nickname }}\
        <button @click="something">X</button>\
        </li>\
    ',
    props: ['title']
})

var StateVM = new Vue({
    el: 'body',
    data: {
        status: 0,
    },
    methods: {

    }
})

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
        status: 'wait',
        selection: [],
    },
    methods: {
        make_team: function () {

        },
        team_vote: function () {

        },
        task_vote: function () {

        },
        assassin: function () {

        }
    }
})

function dialogNotify(content) {
    alert(content);
};

document.onload = function () {

};

// var socket = io();

// socket.on('connection', function (data) {
//     // TODO
// });

// socket.on('join', function (data) {
//     // TODO
//     alert(data);
// });

// socket.on('operate', function (data) {
//     // TODO
// });

// socket.on('msg', function (data) {
//     // TODO
// });
