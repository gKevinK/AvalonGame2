enum ROLE {
  Merlin = 0,
  Percival,
  Loyalist,
  Assassin,
  Morgana,
  Mordred,
  Oberon,
  Minion,
  Lancelot,
}

enum STATUS {
  Wait = 0,

}

const config = {
  role: {
    5: [0, 1, 2, 3, 4],
    6: [0, 1, 2, 2, 3, 4],
    7: [0, 1, 2, 2, 3, 4, 6],
    8: [0, 1, 2, 2, 2, 3, 4, 7],
    9: [0, 1, 2, 2, 2, 2, 3, 4, 5],
    10: [0, 1, 2, 2, 2, 2, 3, 4, 5, 6]
  },
  task_player_num: {
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

class AvalonMachine {
  player_num: Number;
  notify: Function;
  role: Array<Number>;
  c_round: Number;
  c_task: Number;
  round: Array<Number>;

  constructor(player_num, notify_callback) {
    this.player_num = player_num;
    this.notify = notify_callback;

    this.role = shuffleCopy(config.role[player_num]);
    this.c_round = 1;
    this.round = config.task_player_num[player_num];
    // TODO
  }

  private _init() {
    // TODO
  }

  private _makeTeam(order, array) {
    // TODO
  }

  private _teamVote(order, agree) {
    // TODO
  }

  private _taskVote(order, success) {
    // TODO
  }

  private _assassin(target) {
    // TODO
  }

  getStatus(order) {
    // TODO
    return {
      current_round: this.c_round, round: this.round,
    }
  }

  operate(order, obj) {
    var result;
    switch (obj.op) {
      case 'make_team':
        // TODO
        result = this._makeTeam(order, obj.list);
        break;
      case 'team_vote':
        // TODO
        result = this._teamVote(order, obj.vote);
        break;
      case 'task_vote':
        // TODO
        result = this._taskVote(order, obj.vote);
        break;
      case 'assassin':
        // TODO
        result = this._assassin(obj.target);
        break;
      default:
        return '错误的操作。';
    }
    return result;
  }
}

module.exports = AvalonMachine;
