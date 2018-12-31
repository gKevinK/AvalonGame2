// TODO
export type IOp = {
    op: "make-team";
    ts: Array<number>;
} | {
    op: "team-vote" | "task-vote" | "assassin";
    t: number;
}

// To be deprecated
export interface IOperation
{
    op: "make-team" | "team-vote" | "team-vote-i" | "team-vote-r" | "task-vote"
        | "task-vote-i" | "task-vote-r" | "assassin" | "end";
    t: number;
    ts: Array<number>;
}

// TODO
export type IGameN = {
    type: "knowledge";
    role: number;
    knowledge: Array<number>;
} | {
    type: "make-team";
    captain: number;
    round: number;
    try: number;
} | {
    type: "team-vote" | "task-vote";
    team: Array<number>;
} | {
    type: "team-vote-i" | "task-vote-i";
    i: number;
} | {
    type: "team-vote-res";
    teamvote: Array<number>;
} | {
    type: "task-vote-res";
    res: number;
} | {
    type: "task-end";
    round: number;
    succ: boolean;
} | {
    type: "assassin";
} | {
    type: "end";
    res: 0 | 1;
    roles: Array<number>;
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
