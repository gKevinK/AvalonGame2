const STATUS = {
  Idle: 0,
  Wait: 1,
  Play: 2,
};

const GSTATUS = {
  Wait: 0,
  MakeTeam: 1,
  TeamVote: 2,
  TaskVote: 3,
  Assassin: 4,
  End: 5,
};

const ROLE = {
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

const tpn = {
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

  c_status: GSTATUS.Wait,
  c_round: 0,
  c_try: 0,
  c_team: [],
  vote: [],
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
    messages: [],
  },
  methods: {
    send: function () {
      socket.emit('msg', this.message);
      this.message = '';
    },
    onMsg: function () {

    }
  }
});

var GameVM = new Vue({
  el: '#game-panel',
  data: {
    status: STATUS.Idle,
    team: [],
    selections: [],
    vote: '',
    target: '',
  },
  methods: {
    makeTeam: function () {
      socket.emit('make-team', JSON.stringify({ list: this.selections }));
    },
    teamVote: function () {
      socket.emit('team-vote', JSON.stringify({ vote: parseInt(this.vote) }));
    },
    taskVote: function () {
      socket.emit('task-vote', JSON.stringify({ vote: parseInt(this.vote) }));
    },
    assassin: function () {
      socket.emit('assassin', JSON.stringify({ target: this.target }));
    },
    onNotify: function (msg) {
      var obj = JSON.parse(msg);
      switch (obj.type) {
        case 'make-team':
          break;
        case 'team-vote':
          break;
        case 'team-res':
          break;
        case 'team-vote-i':
          break;
        case 'task-vote':
          break;
        case 'task-vote-i':
          break;
        case 'assassin':
          break;
        case 'end':
          break;
      }
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
    shared.status = STATUS.Wait;
    localStorage.setItem('user_id', dataObj.user_id);
  });

  socket.on('nofity', function (data) {
    // TODO
    GameVM.onNotify(data);
  });

  socket.on('msg', function (data) {
    // TODO
    MsgVM.onMsg(data);
  });

  socket.on('err', function (data) {
    if (data == 'clear cache!') {
      localStorage.clear();
      status = STATUS.Idle;
    } else {
      alert(data);
    }
  });
}
