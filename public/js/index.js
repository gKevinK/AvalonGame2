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
    vote: [],
    mission_player_num: []
}

function OrderToName(order) {
    return name;
}

function RoleIdToName(id) {
    return Role[id];
}

Vue.component('player', {
    template: '\
        <li>\
            {{ nickname }}\
        <button @click="something">X</button>\
        </li>\
    ',
    props: ['nickname']
});

Vue.component('message', {
    template: '<div>{{ msg.order }}: {{ msg.text }}</div>',
    props: ['msg'],
});

var socket;

var StateVM = new Vue({
    el: 'body',
    data: {
        status: 0,
    },
    methods: {

    }
})

var JoinVM = new Vue({
    el: '#join-panel',
    data: {
        new_room: true,
        player_num: 5,
        room_id: '',
        order: 1,
        random_order: true,
    },
    methods: {
        join: function () {
            var join_json;
            if (this.new_room) {
                join_json = JSON.stringify({
                    player_num: this.player_num,
                });
            } else {
                join_json = JSON.stringify({
                    room_id: this.room_id,
                    order: this.random_order ? 0 : this.order,
                });
            }
            try_join(join_json);
        }
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

function try_join(join_json) {
    socket = io();
    socket.emit('join', join_json);

    socket.on('join', function (data) {
        // TODO
        alert(data);
    });

    socket.on('operate', function (data) {
        // TODO
        alert(data);
    });

    socket.on('msg', function (data) {
        // TODO
        alert(data);
    });
}
