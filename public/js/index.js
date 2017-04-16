var Status = {
  Idle: 0,
  Wait: 1,
  Play: 2,
};

var Role = {
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

function order2name(order) {
  return 'name';
}

function role_id2name(id) {
  return Role[id];
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
  template: '<p>{{ msg.order }} - {{ msg.order | order2name }}: {{ msg.text }}</p>',
  props: ['msg'],
  filters: {
    order2name: order2name,
  }
});

var socket;
var shared = {
  status: 0,
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
    player_num: 5,
    room_id: '',
    order: 1,
    random_order: true,
  },
  methods: {
    join_new: function () {
      try_join(JSON.stringify({
        player_num: this.player_num,
      }));
    },
    join: function () {
      try_join(JSON.stringify({
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
  if (localStorage.getItem('user_id')) {
    try_join(JSON.stringify({ user_id: localStorage.getItem('user_id')}));
  }
};

function try_join(join_json) {
  socket = io();
  socket.emit('join', join_json);

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
}
