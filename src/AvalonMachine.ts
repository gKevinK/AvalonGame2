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
    
    public NotifyCallback : (nums: number[], msg: object) => void;
    
    public Start(): void {
        throw new Error("Method not implemented.");
    }

    public Operate(num: number, operation: object): boolean {
        throw new Error("Method not implemented.");
    }

    makeTeam(): void {

    }

    teamVote(num: number, array: Array<number>): void {

    }

    taskVote(num: number, success: boolean): void {

    }

    taskEndWith(success: boolean): void {

    }

    assassin(target: number): void {
        
    }

    public GetStatus(order: number): object {
        throw new Error("Method not implemented.");
    }

}