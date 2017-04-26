const Util = require('./util.js');

const ROLE = {
  Merlin: 0,
  Percival: 1,
  Loyalist: 2,
  Assassin: 3,
  Morgana: 4,
  Mordred: 5,
  Oberon: 6,
  Minion: 7,
  Lancelot: 8,
}

const STATUS = {
  Wait: 0,
  MakeTeam: 1,
  TeamVote: 2,
  TaskVote: 3,
  Assassin: 4,
  End: 5,
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

class AvalonMachine {

  constructor(player_num, notify_callback) {
    this.pnum = player_num;
    this.notify = notify_callback;

    this.status = STATUS.Wait;
    this.roles = shuffleCopy(config.role[player_num]);
    this.c_round = 0;
    this.c_try = 0;
    this.c_capital = 0;
    this.c_team = [];
    this.c_teamvote = [];
    this.c_taskvote = [];
    this.result = [ -1, -1, -1, -1, -1 ];
    this.round = config.task_player_num[player_num];
    // TODO
  }

  _init() {
    // TODO
    this.status = STATUS.MakeTeam;
    this.c_capital = Util.randomIn(this.pnum);
    this.notify({ players: Util.range(this.pnum),
      msg: { type: 'make_team', player: this.c_capital }});
  }

  _makeTeam(order, array) {
    // TODO
    if (this.status != STATUS.MakeTeam || order != this.c_capital) {
      return '错误的操作。';
    }
    this.c_try += 1;
    this.c_team = array;
    this.c_teamvote.fill(-1);
    this.status = STATUS.TeamVote;
    this.notify({ players: [], msg: {
      type: 'team-vote', content: this.array,
    }});
  }

  _teamVote(order, agree) {
    // TODO
  }

  _taskVote(order, success) {
    // TODO

    var failNum = 0;
    if (failNum == 0 || (this.pnum >= 7 && failNum == 1)) {

    }
  }

  _assassin(target) {
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
