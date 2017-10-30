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

interface IOperationObject
{
    op: string;
    t: number;
    ts: Array<number>;
}

export default class AvalonMachine implements IGameMachine
{
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
        this.pcount = player_count;
        this.NotifyCallback = (os, m) => {};

        throw new Error("Method not implemented.");
    }
    
    NotifyCallback : (nums: number[], msg: object) => void;
    
    Start(): void {
        this.round = 0;
        this.try = 0;
        this.capital = 0;
        this.team.length = config.task_player_num[this.pcount][this.round];
        
        this.NotifyCallback([], { type: 'make-team', capital: this.capital,
                                  round: this.round, try: this.try });
        throw new Error("Method not implemented.");
    }

    Operate(num: number, operation: object): boolean {
        let opr = <IOperationObject>operation;
        switch (opr.op) {
            case "make-team":
                this.makeTeam(opr.ts);
                break;
            case "team-vote":
                this.teamVote(num, opr.t == 1);
                break;
            case "task-vote":
                this.taskVote(num, opr.t == 1);
                break;
            case "assassin":
                this.assassin(0);
                break;
        }
        return true; // TODO : Return operation's result
    }
    
    private makeTeam(array: Array<number>): void {
        // TODO
        this.team = array;
        // this.teamvote.fill(-1);
        this.status = STATUS.TeamVote;
        this.NotifyCallback([], { type: 'team-vote', team: this.team });
    }

    private teamVote(num: number, agree: boolean): void {
        // TODO
        this.teamvote[num] = agree ? 1 : 0;
        this.NotifyCallback([], { type: 'team-vote-i', i: num });
        if (this.teamvote.filter(v => v == -1).length == 0) {
            this.NotifyCallback([], { type: 'team-vote-res', res: this.teamVote });
            if (this.teamvote.filter(v => v == 1).length * 2 > this.pcount) {
                this.NotifyCallback([], { type: 'task-vote', team: this.team });
            } else {
                this.NotifyCallback([], { type: 'team-vote' });
            }
        }
    }

    private taskVote(num: number, success: boolean): void {
        this.taskvote[num] = success ? 1 : 0;
        this.NotifyCallback([], { type: 'task-vote-i', i: num });
        let failNum = this.taskvote.filter(v => v == 1).length;
        if (failNum == 0 || (this.pcount >= 7 && this.round == 3 && failNum == 1)) {
            this.taskEndWith(true);
        } else {
            this.taskEndWith(false);
        }
    }

    private taskEndWith(success: boolean): void {
        // TODO
    }

    private assassin(target: number): void {
        // TODO

        this.NotifyCallback([], { "game-result": 1 });
    }

    GetStatus(num: number): object {
        return {
            pcount: this.pcount,
            status: this.status,
            roles: [],
            round: this.round,
            try: this.try,
            capital: this.capital,
            // TODO
        };
    }

}