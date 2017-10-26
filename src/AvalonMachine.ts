import IGameMachine from './IGameMachine'

enum ROLE {
    Merlin,
    Percival,
    Loyalist,
    Assassin,
    Morgana,
    Mordred,
    Oberon,
    Minion,
    // Lancelot: 8, 9,
}

enum STATUS {
    Wait,
    MakeTeam,
    TeamVote,
    TaskVote,
    Assassin,
    End,
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

export default class AvalonMachine implements IGameMachine {

    pcount: number;
    status: STATUS;
    roles: Array<ROLE>;
    tpcs: Array<number>;

    round: number;
    try: number;
    capital: number;
    team: Array<number> = [];
    teamvote: Array<number> = [];
    taskvote: Array<number> = [];
    result: Array<number> = [ -1, -1, -1, -1, -1 ];

    constructor(player_count: number) {
        this.NotifyCallback = (os, m) => {};
    }
    
    NotifyCallback : (nums: number[], msg: object) => void;
    
    Start(): void {
        this.round = 0;
        this.try = 0;
        this.capital = 0;
        this.team.length = config.task_player_num[this.pcount][this.round];
        
        throw new Error("Method not implemented.");
    }

    Operate(num: number, operation: { op: string }): boolean {
        switch (operation.op) {
            case "make-team":
                this.makeTeam([]);
                break;
            case "team-vote":
                this.teamVote(num, []);
                break;
            case "task-vote":
                this.taskVote(num, true);
                break;
            case "assassin":
                this.assassin(0);
                break;
        }
        throw new Error("Method not implemented.");
    }
    
    private makeTeam(array: Array<number>): void {
        // TODO
    }

    private teamVote(num: number, array: Array<number>): void {
        // TODO
    }

    private taskVote(num: number, success: boolean): void {
        // TODO
    }

    private taskEndWith(success: boolean): void {
        // TODO
    }

    private assassin(target: number): void {
        // TODO

        this.NotifyCallback([], { "game-result": 1 });
    }

    GetStatus(order: number): object {
        throw new Error("Method not implemented.");
    }

}