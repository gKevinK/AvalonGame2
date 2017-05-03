var STATUS = {
  Idle: 0,
  Wait: 1,
  Play: 2,
};

var ROLE = {
  0: '梅林',
  1: '派西维尔',
  2: '忠臣',
  3: '刺客',
  4: '莫甘娜',
  5: '莫德雷德',
  6: '奥伯伦',
  7: '爪牙',
  // 8 / 9: '兰斯洛特',
};

var tpn = {
  5: [2, 3, 2, 3, 3],
  6: [2, 3, 4, 3, 4],
  7: [2, 3, 3, 4, 4],
  8: [3, 4, 4, 5, 5],
  9: [3, 4, 4, 5, 5],
  10: [3, 4, 4, 5, 5]
}

var Info = {
  role: '',
  player_id: '',
  player_num: '',
  known_player: [],

  current_status: STATUS.Idle,
  current_round: 0,
  current_try: 0,
  current_team: [],
  vote: [],
  mission_player_num: []
}

function order2name(order) {
  return 'name';
}

function role_id2name(id) {
  return ROLE[id];
}

// Vue.component('player', {
//   template: '\
//         <li>\
//             {{ nickname }}\
//         <button @click="something">X</button>\
//         </li>\
//     ',
//   props: ['nickname']
// });

Vue.component('message', {
  template: '<p>{{ msg.order }} - {{* msg.order | order2name }}: {{ msg.text }}</p>',
  props: ['msg'],
  filters: {
    order2name: order2name,
  }
});

var socket;
var shared = {
  status: STATUS.Idle,
  player_name: [],
}

var StateVM = new Vue({
  el: 'body',
  data: {
    status: shared.status,
  },
  methods: {

  }
})

var JoinVM = new Vue({
  el: '#join-panel',
  data: {
    name: '',
    player_num: 5,
    room_id: '',
    order: 1,
    random_order: true,
  },
  methods: {
    join_new: function () {
      try_join(JSON.stringify({
        name: this.name,
        player_num: this.player_num,
        order: this.random_order ? 0 : this.order,
      }));
    },
    join: function () {
      try_join(JSON.stringify({
        name: this.name,
        room_id: this.room_id,
        order: this.random_order ? 0 : this.order,
      }));
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
    selections: [],
    vote: '',
    target: '',
  },
  methods: {
    make_team: function () {
      socket.emit('make-team', JSON.stringify({ list: this.selections }));
    },
    team_vote: function () {
      socket.emit('team-vote', JSON.stringify({ vote: this.vote }));
    },
    task_vote: function () {
      socket.emit('task-vote', JSON.stringify({ vote: this.vote }));
    },
    assassin: function () {
      socket.emit('assassin', JSON.stringify({ target: this.target }));
    }
  }
})

function dialogNotify(content) {
  alert(content);
};

document.onload = function () {
  if (localStorage.getItem('user_id')) {
    try_join(JSON.stringify({ user_id: localStorage.getItem('user_id')}), true);
  }
};

function try_join(join_json, reconnect) {
  if (socket) {
    socket.disconnect();
  }
  socket = io();
  if (reconnect) {
    socket.emit('reconn', join_json);
  } else {
    socket.emit('join', join_json);
  }

  socket.on('join', function (data) {
    // TODO
    var dataObj = JSON.parse(data);
    alert(data);
    shared.status = 1;
    localStorage.setItem('user_id', dataObj.user_id);
  });

  socket.on('nofity', function (data) {
    // TODO
    alert(data);
  });

  socket.on('msg', function (data) {
    // TODO
    alert(data);
  });

  socket.on('err', function (data) {
    if (data == 'clear cache!') {
      localStorage.clear();
    } else {
      alert(data);
    }
  });
}
