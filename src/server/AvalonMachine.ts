import IGameMachine from './IGameMachine';
import { IGameStatus } from '../common/AvalonInterface';

//#region Help functions
function shuffleCopy (array: Array<any>) {
    var a = array.slice();
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var x = a[j];
        a[j] = a[i];
        a[i] = x;
    }
    return a;
}

function randomInt (max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}

//#endregion


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
        5:  [0, 1, 2, 3, 4],
        6:  [0, 1, 2, 2, 3, 4],
        7:  [0, 1, 2, 2, 3, 4, 6],
        8:  [0, 1, 2, 2, 2, 3, 4, 7],
        9:  [0, 1, 2, 2, 2, 2, 3, 4, 5],
        10: [0, 1, 2, 2, 2, 2, 3, 4, 5, 6],
    },
    task_player_num: {
        5:  [2, 3, 2, 3, 3],
        6:  [2, 3, 4, 3, 4],
        7:  [2, 3, 3, 4, 4],
        8:  [3, 4, 4, 5, 5],
        9:  [3, 4, 4, 5, 5],
        10: [3, 4, 4, 5, 5],
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

    round: number = 0;
    try: number = 0;
    captain: number = 0;
    team: Array<number> = [];
    teamvote: Array<number> = [];
    taskvote: Array<number> = [];
    result: Array<number> = [ -1, -1, -1, -1, -1 ];

    NotifyCallback : (nums: number[], msg: object) => void;

    constructor(player_count: number) {
        this.pcount = player_count;
        this.NotifyCallback = (os, m) => {};
        this.status = STATUS.Wait;
        this.teamvote = Array(this.pcount).fill(-1);
    }
    
    private knowledge(num: number) : Array<number> {
        var r = this.roles[num];
        var knowledge = [];
        if (r == ROLE.Merlin) {
            this.roles.map((v1, i1) => {
                if ([ROLE.Morgana, ROLE.Minion, ROLE.Oberon, ROLE.Assassin].some(v2 => v1 == v2))
                    knowledge.push(i1);
            });
        } else if (r == ROLE.Percival) {
            this.roles.map((v1, i1) => {
                if ([ROLE.Merlin, ROLE.Morgana].some(v2 => v1 == v2))
                    knowledge.push(i1);
            });
        } else if ([ROLE.Morgana, ROLE.Minion, ROLE.Assassin, ROLE.Mordred].some(v1 => r == v1)) {
            this.roles.map((v1, i1) => {
                if ([ROLE.Morgana, ROLE.Minion, ROLE.Assassin, ROLE.Mordred].some(v2 => v1 == v2))
                    knowledge.push(i1);
            });
        }
        return knowledge;
    }

    Start(): void {
        this.round = 0;
        this.try = 0;
        this.team.length = config.task_player_num[this.pcount][this.round];
        this.roles = shuffleCopy(config.role[this.pcount]);

        this.roles.map((r, i) => {
            this.NotifyCallback([i], { type: 'knowledge', role: r, knowledge: this.knowledge(i) });
        });

        this.captain = randomInt(this.pcount);
        this.NotifyCallback([], { type: 'make-team', captain: this.captain,
                                  round: this.round, try: this.try });
        this.status = STATUS.MakeTeam;
    }

    Operate(num: number, operation: object): boolean {
        let opr = <IOperationObject>operation;
        let res: boolean = true;
        switch (opr.op) {
            case "make-team":
                res = this.makeTeam(opr.ts);
                break;
            case "team-vote":
                res = this.teamVote(num, opr.t == 1);
                break;
            case "task-vote":
                res = this.taskVote(num, opr.t == 1);
                break;
            case "assassin":
                res = this.assassin(0);
                break;
        }
        return res;
    }
    
    private makeTeam(array: Array<number>): boolean {
        // TODO
        this.team = array;
        this.teamvote.fill(-1);
        this.status = STATUS.TeamVote;
        this.NotifyCallback([], { type: 'team-vote', team: this.team });
        return true;
    }

    private teamVote(num: number, agree: boolean): boolean {
        this.teamvote[num] = agree ? 1 : 0;
        this.NotifyCallback([], { type: 'team-vote-i', i: num });
        if (this.teamvote.some(v => v == -1))
            return true;
        this.NotifyCallback([], { type: 'team-vote-res', res: this.teamVote });
        if (this.teamvote.filter(v => v == 1).length * 2 > this.pcount) {
            this.status = STATUS.TaskVote;
            this.taskvote = Array(this.team.length).fill(-1);
            this.NotifyCallback([], { type: 'task-vote', team: this.team });
        } else {
            if (this.try == 4) {
                this.taskEndWith(false);
            } else {
                this.try += 1;
                this.status = STATUS.MakeTeam;
                this.NotifyCallback([], { type: 'make-team', captain: this.captain,
                                          round: this.round, try: this.try });
            }
        }
        return true;
    }

    private taskVote(num: number, success: boolean): boolean {
        this.taskvote[num] = success ? 1 : 0;
        this.NotifyCallback([], { type: 'task-vote-i', i: num });
        if (this.taskvote.some(v => v == -1))
            return true;
        let failNum = this.taskvote.filter(v => v == 0).length;
        if (failNum == 0 || (this.pcount >= 7 && this.round == 3 && failNum == 1)) {
            this.NotifyCallback([], { type: 'task-vote-res', res: failNum });
            this.taskEndWith(true);
        } else {
            this.NotifyCallback([], { type: 'task-vote-res', res: failNum });
            this.taskEndWith(false);
        }
        return true;
    }

    private taskEndWith(success: boolean): void {
        // TODO
        this.result[this.round] = success ? 1 : 0;
        if (this.result.filter(v => v == 1).length == 3) {
            this.status = STATUS.Assassin;
            this.NotifyCallback([], { type: 'assassin', });
        } else if (this.result.filter(v => v == 0).length == 3) {
            this.status = STATUS.End;
            this.NotifyCallback([], { type: 'end', res: 1, content: this.roles })
        } else {
            this.round += 1;
            this.try = 1;
            this.status = STATUS.MakeTeam;
            this.NotifyCallback([], { type: 'make-team', player: this.captain,
                                      round: this.round, try: this.try });
        }
    }

    private assassin(target: number): boolean {
        let res = this.roles[target] == ROLE.Merlin ? 0 : 1;
        this.status = STATUS.End;
        this.NotifyCallback([], { type: 'end', res: res, roles: this.roles });
        return true;
    }

    GetStatus(num: number): object {
        // TODO
        return <IGameStatus>{
            pcount: this.pcount,
            status: this.status,
            role: this.roles[num],
            knowledge: this.knowledge(num),
            result: this.result,
            round: this.round,
            try: this.try,
            captain: this.captain,
            team: this.team,
        };
    }
}