const config = {
  role: {
    5: [0, 1, 2, 3, 4],
    6: [0, 1, 2, 2, 3, 4],
    7: [0, 1, 2, 2, 3, 4, 6],
    8: [0, 1, 2, 2, 2, 3, 4, 7],
    9: [0, 1, 2, 2, 2, 2, 3, 4, 5],
    10: [0, 1, 2, 2, 2, 2, 3, 4, 5, 6]
  },
  mission: {
    5: [2, 3, 2, 3, 3],
    6: [2, 3, 4, 3, 4],
    7: [2, 3, 3, 4, 4],
    8: [3, 4, 4, 5, 5],
    9: [3, 4, 4, 5, 5],
    10: [3, 4, 4, 5, 5]
  },
}

function shuffleCopy(array) {
  var randarr = [];
  for (var i = 0; i < array.length; i++) {
    randarr.push(Math.random());
  }
  return array.slice().sort(function (a, b) {
    return randarr[a] - randarr[b];
  });
}

class AvalonCore {
  constructor(player_num, notify_callback) {
    this.player_num = player_num;
    this.notify = notify_callback;

    this.role = shuffleCopy(config.role[player_num]);
    this.current_round = 1;
    this.round = config.mission[player_num];
    // TODO
  }

  init() {
    // TODO
  }

  makeTeam(order, array) {
    // TODO
  }

  teamVote(order, agree) {
    // TODO
  }

  taskVote(order, success) {
    // TODO
  }

  assassin(target) {
    // TODO
  }

  getStatus(order) {
    // TODO
    return {
      current_round: this.current_round, round: this.round,
    }
  }
}

class AvalonMachine {
  constructor (player_num, notify_callback) {
    this.core = new AvalonCore(player_num, notify_callback);
  }

  init() {
    this.core.init();
  }

  operate(order, obj) {
    var result;
    switch (obj.op) {
      case 'make_team':
        // TODO
        result = this.core.makeTeam(order, obj.list);
        break;
      case 'team_vote':
        // TODO
        result = this.core.teamVote(order, obj.vote);
        break;
      case 'task_vote':
        // TODO
        result = this.core.taskVote(order, obj.vote);
        break;
      case 'assassin':
        // TODO
        result = this.core.assassin(obj.target);
        break;
      default:
        return '错误的操作。';
    }
    return result;
  }

  getStatus(order) {
    this.core.getStatus(order);
  }
}

module.exports = AvalonMachine;
