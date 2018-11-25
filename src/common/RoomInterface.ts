export interface IJoinNew {
    conf: IRoomConfig;
}

export interface IJoin {
    roomid: string;
    seat: number;
}

export interface IRoomConfig {
    num: number;
    // TODO
    // allowAudience: boolean;
}

export interface IUserStatus {
    id: string,
    name: string,
    roomid?: string,
    token: string,
}

export interface IRoomStatus {
    userid: string;
    roomid: string;
    _users: { info: IUserInfo, seat: number }[];
    prepare: boolean[];
    num: number;
    status: number;

    game?: object;
}
export interface IStatus {
    user?: IUserStatus;
    room?: IRoomStatus;
}

export interface IUserInfo {
    userid: string;
    name: string;
}

export type IRoomOp = { op: "prepare" | "exit" } | { op: "move"; t: number; }

export type IRoomN = {
    type: "exit-i" | "disconn-i" | "reconn-i" | "move-i";
    userid: string;
    t: number;
} | {
    type: "prepare";
    t: number;
}
