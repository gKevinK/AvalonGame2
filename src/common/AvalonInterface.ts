// export interface IOp {
    
// }

export interface IOperation
{
    op: "make-team" | "team-vote" | "team-vote-i" | "team-vote-r" | "task-vote"
        | "task-vote-i" | "task-vote-r" | "assassin" | "end";
    t: number;
    ts: Array<number>;
}

export interface IGameStatus
{
    pcount: number,
    status: number,
    role: number,
    knowledge: number[],
    result: number[],
    round: number,
    try: number,
    captain: number,
    team: number[],
}

// export type IOp = IOperation | IGameStatus;