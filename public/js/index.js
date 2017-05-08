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
  room_id: '',
  player_name: [],
  player_stat: [],
  player_num: 5,
  order: 1,
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
    player_num: shared.player_num,
    room_id: shared.room_id,
    order: shared.order,
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
    status: GSTATUS.Wait,
    player_num: shared.player_num,
    player_name: shared.player_name,
    player_stat: shared.player_stat,
    round: 0,
    try: 0,
    capital: 0,
    result: [ -1, -1, -1, -1, -1 ],
    role: 0,
    knowledge: [],
    team: [],
    selections: [],
    teamvote: [],
    vote_i: [],
    vote: '',
    target: '',
  },
  computed: {
    knowledge_str: function() {
      if (this.knowledge.length == 0) {
        return '';
      } else {
        return '已知身份： ' + this.knowledge.map(function(i) { return i+1;}).join(' 号、') + ' 号';
      }
    },
  },
  methods: {
    makeTeam: function () {
      socket.emit('make-team', JSON.stringify({ list: this.selections.map(parseInt) }));
    },
    teamVote: function () {
      socket.emit('team-vote', JSON.stringify({ vote: parseInt(this.vote) }));
    },
    taskVote: function () {
      socket.emit('task-vote', JSON.stringify({ vote: parseInt(this.vote) }));
    },
    assassin: function () {
      socket.emit('assassin', JSON.stringify({ target: parseInt(this.target) }));
    },
    onNotify: function (msg) {
      var obj = JSON.parse(msg);
      switch (obj.type) {
        case 'init':
          // TODO
          break;
        case 'join-i':
          this.player_name[obj.order] = obj.name;
          this.player_stat[obj.order] = 1;
          break;
        case 'exit':
          this.player_stat[obj.order] = 0;
          break;
        case 'knowledge':
          this.role = obj.role;
          this.knowledge = obj.known;
          // TODO: Notify
          break;
        case 'make-team':
          this.status = GSTATUS.MakeTeam;
          this.round = obj.round;
          this.try = obj.try;
          this.capital = obj.player;
          this.vote_i.fill(0);
          break;
        case 'team-vote':
          this.status = GSTATUS.TeamVote;
          this.team = obj.content;
          this.vote_i.fill(0);
          break;
        case 'team-res':
          // TODO
          this.teamvote = obj.content;
          dialogNotify(obj.content);
          break;
        case 'team-vote-i':
          this.vote_i[obj.content] = 1;
          break;
        case 'task-vote':
          this.status = GSTATUS.TaskVote;
          break;
        case 'task-vote-i':
          this.vote_i[obj.content] = 1;
          break;
        case 'assassin':
          this.status = GSTATUS.Assassin;
          break;
        case 'end':
          this.status = GSTATUS.End;
          dialogNotify((obj.result == 1 ? "好人获胜\n" : "坏人获胜\n") + obj.content); // TODO
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
    try_join(JSON.stringify({ user_id: localStorage.getItem('user_id') }), true);
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
    var obj = JSON.parse(data);
    alert(data);
    shared.status = STATUS.Wait;
    shared.room_id = obj.room_id;
    shared.order = obj.order;
    localStorage.setItem('user_id', obj.user_id);
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
