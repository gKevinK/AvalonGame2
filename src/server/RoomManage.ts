import IGameMachine from './IGameMachine'
import Machine from './AvalonMachine'
import { IRoomConfig, IRoomStatus } from '../common/RoomInterface'
// import { User } from './UserManage';

const Util = {
    range: function (n: number) {
        return [...Array(n).keys()];
    },

    randomIn: function (n: number) {
        return Math.floor(n * Math.random());
    }
};

interface UserInfo
{
    userid: string;
    name: string;
}

type NotifyCb = (type: string, msg: object) => void;

class Seat
{
    userinfo?: UserInfo = undefined;
    prepared: boolean = false;
    private msgs: object[] = [];
    private NotifyCallback?: NotifyCb = undefined;

    sit (userinfo: UserInfo, callback: NotifyCb): void {
        this.userinfo = userinfo;
        this.NotifyCallback = callback;
        this.msgs.forEach(m => {
            this.notify('msg', m);
        });
    }

    empty (): boolean {
        return this.NotifyCallback === undefined;
    }

    message (msg: { userid: string, text: string }): void {
        this.msgs.push(msg);
        this.NotifyCallback('msg', msg);
    }

    notify (type: string, msg: object): void {
        if (this.NotifyCallback)
            this.NotifyCallback(type, msg);
    }

    // offline (): void {
    //     this.NotifyCallback = undefined;
    // }

    leave (): void {
        this.userinfo = undefined;
        this.notify('exit', {});
        this.NotifyCallback = undefined;
    }
}

export class Room
{
    id: string;
    num: number;
    machine?: IGameMachine;
    seats: Seat[];
    audience: Seat;
    private _user: Map<string, { info: UserInfo, seat: number,  }>;
    
    constructor (id: string, conf: IRoomConfig) {
        this.id = id;
        this.num = conf.num;
        this.seats = Util.range(this.num).map(_ => new Seat());
    }

    private start () {
        this.machine = new Machine(this.num);
        this.machine.NotifyCallback = (ids, obj) => this.notify(ids, obj);
        this.machine.Start();
    }

    private notify (ids: Array<number>, obj: object) : void {
        if (ids.length == 0) {
            ids = Util.range(this.num);
        }
        ids.forEach(i => {
            this.seats[i].notify('update', obj);
        });
    }

    join (n: number, userinfo: UserInfo, callback: (type: string, msg: object) => void) : void {
        let seat = this.seats[n];
        seat.sit(userinfo, callback);
        seat.notify('join', { room_id: this.id, order: n });
        this.seats.forEach(s => s.notify('room', { type: 'join-i', order: n, name: name }));
        if (this.machine)
            seat.notify('op', { type: 'status', names: this.seats.map(s => s.userinfo.name), status: this.machine.GetStatus(n) });
        if (! this.machine && this.seats.every(s => !s.empty()))
            this.start();
    }

    RoomOpr (op: string) : boolean {
        // TODO
        return false;
    }

    Operate (userid: string, op: string) : boolean {
        let d = this._user.get(userid);
        if (d === undefined || d.seat === -1) return false;
        return this.machine.Operate(d.seat, JSON.parse(op));
    }

    Message (userid: string, msg: string) : void {
        this.seats.forEach(s => s.message({ userid: userid, text: msg }));
    }

    GetStatus (userid: string) : IRoomStatus | undefined {
        let d = this._user.get(userid);
        if (d === undefined) return undefined;
        return {
            roomid: this.id,
            userid: userid,
            _users: {}, // TODO
            prepare: this.seats.map(s => s.prepared),
            
            game: this.machine.GetStatus(d.seat),
        };
    }

    exit (userid: string) : void {
        this.seats.forEach(s => s.notify('room', { type: 'exit-i', userid: userid }));
        if (this.id2seat.get(userid) !== -1)
            this.seats[this.id2seat.get(userid)].leave();
        else
            this.audience.delete(userid);
    }
}

export default class RoomManager
{
    private rooms: Map<string, Room>;

    constructor() {
        this.rooms = new Map<string, Room>();
    }

    GetRoom (roomid: string) : Room {
        return this.rooms.get(roomid);
    }

    JoinNew (conf: RoomConfig, order: number, userinfo: UserInfo, callback: (type: string, msg: object) => void) : boolean {
        let id = this.getId();
        this.rooms.set(id, new Room(id, conf));
        console.log('+ Room ' + id + ' created.');
        let r = this.Join(id, order, userinfo, callback);
        if (r == false) {
            this.rooms.delete(id);
            return false;
        }
        return true;
    }

    Join (id: string, order: number, userinfo: UserInfo, callback: (type: string, msg: object) => void) : boolean {
        if (! this.rooms.has(id)) return false;
        let room = this.GetRoom(id);
        if (order == -1) {
            let ss = room.seats.filter(s => s.empty());
            if (ss.length == 0) return false;
            order = room.seats.indexOf(ss[Util.randomIn(ss.length)]);
        }
        if (order >= room.num || !room.seats[order].empty()) return false;
        room.join(order, userinfo, callback);
        console.log('  Room ' + room.id + ' has new user ' + name + '.');
        return true;
    }

    Exit (userid: string, roomid: string) : void {
        if (! this.rooms.has(roomid)) return;
        this.GetRoom(roomid).exit(userid);
        if (this.GetRoom(id).seats.every(s => s.empty())) {
            this.rooms.delete(id);
            console.log('- Room ' + id + ' destroyed.');
        }
    }

    Disconnect (userid: string) : void {
        // TODO
    }

    private getId(): string {
        var range = 100;
        while (this.rooms.size > range * 0.2)
            range *= 10;
        while (true) {
            let k = Math.floor((Math.random() * 0.9 + 0.1) * range).toString();
            if (! this.rooms.has(k)) {
                return k;
            }
        }
    }
}
