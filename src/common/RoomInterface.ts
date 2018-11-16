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

export interface IRoomOp {
    op: "prepare" | "exit" | "move";
    t?: number;
}

export interface IRoomN {
    type: "exit-i" | "move";
    
}