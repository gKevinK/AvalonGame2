export interface IRoomConfig {
    num: number;
    // TODO
    // allowAudience: boolean;
}

export interface IRoomStatus {
    userid: string;
    roomid: string;
    _users: { [key:string]: { info: UserInfo, seat: number } };
    prepare: boolean[];

    game: object;
}
export interface IStatus {
    user: {
        id: string,
        name: string,
        roomid: string,
        token: string,
    };
    room?: IRoomStatus;
}

export interface UserInfo {
    userid: string;
    name: string;
}

export interface IRoomOp {
    op: "exit" | "take";
    t?: number;
}

export interface IRoomN {
    type: "exit-i";
    
}