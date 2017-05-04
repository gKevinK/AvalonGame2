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
  // Lancelot: 8 / 9
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
    this.c_teamvote.length = this.pnum;
    this.c_taskvote = [];
    this.c_taskvote.length = this.pnum;
    this.result = [ -1, -1, -1, -1, -1 ];
    this.tpn = config.task_player_num[player_num];
    // TODO
  }

  _start() {
    // TODO
    console.log(this.roles);
    this.roles.map((v, i) => {
      var knowledge = [];
      if (v == ROLE.Merlin) {
        this.roles.map((v1, i1) => {
          if ([ROLE.Minion, ROLE.Morgana, ROLE.Oberon, ROLE.Assassin].some(v2 => v1 == v2))
            knowledge.push(i1);
        });
      } else if ([ROLE.Morgana, ROLE.Minion, ROLE.Assassin, ROLE.Mordred].some(v1 => v == v1)) {
        this.roles.map((v1, i1) => {
          if ([ROLE.Morgana, ROLE.Minion, ROLE.Assassin, ROLE.Mordred].some(v2 => v1 == v2))
            knowledge.push(i1);
        });
      }
      this.notify([i], { role: v, known: knowledge });
    });

    this.status = STATUS.MakeTeam;
    this.c_capital = Util.randomIn(this.pnum);
    this.notify([], { type: 'make_team', player: this.c_capital,
                      round: this.c_round, try: this.c_try });
  }

  _makeTeam(order, array) {
    if (this.status != STATUS.MakeTeam || order != this.c_capital) {
      return '错误的操作。';
    }
    this.c_team = array;
    this.c_teamvote.fill(-1);
    this.status = STATUS.TeamVote;
    this.notify([], { type: 'team-vote', content: this.array });
  }

  _teamVote(order, agree) {
    // TODO
    this.c_teamvote[order] = agree;
    this.notify([], { type: 'team-vote-i', content: order });
    if (this.c_teamvote.findIndex(-1) == -1) {
      this.notify([], { type: 'team-res', content: this.c_teamvote });
      if (this.c_teamvote.filter(x => x == 1).length > Math.floor(this.pnum / 2)) {
        this.status = STATUS.TaskVote;
        this.c_taskvote.fill(-1);
        this.notify([], { type: 'task-vote', team: this.c_team });
      } else {
        if (this.c_try == 4) {
          this._taskEndWith(false);
        } else {
          this.c_try += 1;
          this.status = STATUS.MakeTeam;
          this.notify([], { type: 'make-team', player: this.c_capital,
                            round: this.c_round, try: this.c_try });
        }
      }
    }
  }

  _taskVote(order, success) {
    // TODO
    this.c_taskvote[order] = success;
    this.notify([], { type: 'task-vote-i', content: order });
    var failNum = this.c_taskvote.filter(v => v == 1).length;
    if (failNum == 0 || (this.pnum >= 7 && this.round == 3 && failNum == 1)) {
      this._taskEndWith(true);
    } else {
      this._taskEndWith(false);
    }
  }

  _taskEndWith(success) {
    this.result[this.c_round] = success ? 1 : 0;
    if (this.result.filter(v => v == 1).length == 3) {
      this.status = STATUS.Assassin;
      this.notify([], { type: 'assassin', });
    } else if (this.result.filter(v => v == 0).length == 3) {
      this.status = STATUS.End;
      this.notify([], { type: 'end', result: 1, content: this.roles })
    } else {
      this.c_round += 1;
      this.c_try = 1;
      this.status = STATUS.MakeTeam;
      this.notify([], { type: 'make-team', player: this.c_capital,
                        round: this.c_round, try: this.c_try });
    }
  }

  _assassin(target) {
    var res = this.roles[target] == ROLE.Merlin ? 0 : 1;
    this.status = STATUS.End;
    this.notify([], { type: 'end', result: res, content: this.roles });
  }

  getStatus(order) {
    // TODO
    return {
      round: this.c_round,
      try: this.c_try,
      capital: this.c_capital,
      team: this.c_team,
      teamvote: this.c_teamvote.map(v => v >= 0),
      taskvote: this.c_taskvote.map(v => v >= 0),
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
