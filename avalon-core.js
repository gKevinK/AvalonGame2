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

class AvalonCore {
  constructor(player_num, notify_callback) {
    this.player_num = player_num;
    this.notify = notify_callback;

    this.current_round = 1;
    this.round = config.mission[player_num];
    // TODO
  }

  init() {
    // TODO
  }

  operate(order, obj) {
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
    this.core.operate(order, obj);
  }

  getStatus(order) {
    this.core.getStatus(order);
  }
}

module.exports = AvalonMachine;
