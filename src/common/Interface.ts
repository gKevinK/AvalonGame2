export class RoomConfig {
    num: number;

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