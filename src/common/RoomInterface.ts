export class RoomConfig {
    num: number;
    // TODO
    // allowAudience: boolean;
}

export interface IStatus {
    user: {
        id: string,
        name: string,
        roomid: string,
        token: string,
    };
    room?: object;
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