import IGameMachine from './IGameMachine'
import Machine from './AvalonMachine'
import { IUserInfo, IRoomConfig, IRoomStatus, IRoomOp, IRoomN } from '../common/RoomInterface'
// import { User } from './UserManage';

const Util = {
    range: function (n: number) {
        return [...Array(n).keys()];
    },

    randomIn: function (n: number) {
        return Math.floor(n * Math.random());
    }
};

type NotifyCb = (type: string, msg: object) => void;

class Seat
{
    userinfo?: IUserInfo = undefined;
    prepared: boolean = false;
    // private msgs: object[] = [];
    NotifyCallback?: NotifyCb = undefined;

    sit (userinfo: IUserInfo, callback: NotifyCb): void {
        this.userinfo = userinfo;
        this.NotifyCallback = callback;
        // this.msgs.forEach(m => {
        //     this.notify('msg', m);
        // });
    }

    empty (): boolean {
        return this.NotifyCallback === undefined;
    }

    message (msg: { userid: string, text: string }): void {
        // this.msgs.push(msg);
        this.notify('msg', msg);
    }

    notify (type: string, msg: object): void {
        if (this.NotifyCallback)
            this.NotifyCallback(type, msg);
    }

    offline (): void {
        this.NotifyCallback = undefined;
    }

    leave (): void {
        this.userinfo = undefined;
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
    private _user: Map<string, { info: IUserInfo, seat: number, cb?: NotifyCb }>;
    
    constructor (id: string, conf: IRoomConfig) {
        this.id = id;
        this.num = conf.num;
        this.seats = Util.range(this.num).map(_ => new Seat());
        this.audience = new Seat();
        this._user = new Map();
    }

    private start () {
        this.machine = new Machine(this.num);
        this.machine.NotifyCallback = (ids, obj) => this.notify(ids, 'game', obj);
        this.machine.Start();
    }

    private notify (ids: number | Array<number>, type: string, obj: object) : void {
        if (typeof ids === 'number') {
            if (ids === -1) {
                this._user.forEach(u => {
                    if (u.seat === -1 && u.cb) u.cb(type, obj);
                })
            } else {
                this.seats[ids].notify(type, obj);
            }
        } else {
            if (ids.length === 0) {
                ids = Util.range(this.num).concat([ -1 ]);
            }
            ids.forEach(i => this.notify(i, type, obj));
        }
    }

    join (n: number, userinfo: IUserInfo, callback: NotifyCb) : void {
        this.seats.forEach(s => s.notify('room', { type: 'join-i', order: n, name: userinfo.name }));
        this._user.set(userinfo.userid, { info: userinfo, seat: n, cb: callback });
        if (n >= 0) {
            let seat = this.seats[n];
            this._user.set(userinfo.userid, { info: userinfo, seat: n, cb: callback });
            seat.sit(userinfo, callback);
        }
        callback('join', { roomid: this.id, order: n });
        if (! this.machine && this.seats.every(s => !s.empty()))
            this.start();
    }

    RoomOpr (userid: string, op: IRoomOp) : boolean {
        // TODO
        let u = this._user.get(userid);
        if (!u) return false;
        switch (op.op) {
            case "move":
                return this.move(userid, op.t);
            case "prepare":
                if (u.seat === -1) return false;
                this.seats[u.seat].prepared = true;
                this._user.forEach(u => u.cb && u.cb('room', <IRoomN>{ type: 'prepare', t: u.seat }));
                break;
        }
        return false;
    }

    move (userid: string, t: number) : boolean {
        let u = this._user.get(userid);
        if (!u || !u.cb) return false;
        if (u.seat !== -1)
            this.seats[u.seat].leave();
        if (t !== -1) {
            if (!this.seats[t] || !this.seats[t].empty()) return false;
            this.seats[t].sit(u.info, u.cb);
        }
        u.seat = t;
        this._user.forEach(u => u.cb && u.cb('room', <IRoomN>{ type: 'move-i', userid: userid, t: t }));
        return true;
    }

    Operate (userid: string, op: string) : boolean {
        let d = this._user.get(userid);
        if (!d || d.seat === -1 || !this.machine) return false;
        return this.machine.Operate(d.seat, JSON.parse(op));
    }

    Message (userid: string, msg: string) : void {
        let u = this._user.get(userid);
        if (!u) return;
        this.notify([], 'message', { userid: userid, seat: u.seat, text: msg });
    }

    Disconnect (userid: string) : void {
        let u = this._user.get(userid);
        if (! u) return;
        this._user.forEach(s => s.cb && s.cb('room', <IRoomN>{ type: 'disconn-i', userid: userid }));
        if (u.seat !== -1) {
            this.seats[u.seat].offline();
        }
        u.cb = undefined;
    }

    Reconnect (userid: string, cb: NotifyCb) : void {
        let u = this._user.get(userid);
        if (!u) return;
        this._user.forEach(s => s.cb && s.cb('room', <IRoomN>{ type: 'reconn-i', userid: userid }));
        u.cb = cb;
        if (u.seat !== -1)
            this.seats[u.seat].NotifyCallback = cb;
    }

    GetStatus (userid: string) : IRoomStatus | undefined {
        let d = this._user.get(userid);
        if (!d) return undefined;
        return {
            roomid: this.id,
            userid: userid,
            _users: [...this._user.values()].map(v => { return { info: v.info, seat: v.seat }; }),
            prepare: this.seats.map(s => s.prepared),
            num: this.num,
            status: 1,
            
            game: this.machine ? this.machine.GetStatus(d.seat) : undefined,
        };
    }

    exit (userid: string) : void {
        this._user.forEach(s => s.cb && s.cb('room', { type: 'exit-i', userid: userid }));
        let u = this._user.get(userid);
        if (u) {
            if (u.seat !== -1) this.seats[u.seat].leave();
            u.cb && u.cb('exit', { });
            this._user.delete(userid);
        }
    }
}

export default class RoomManager
{
    private rooms: Map<string, Room>;

    constructor() {
        this.rooms = new Map();
    }

    GetRoom (roomid: string) : Room | undefined {
        return this.rooms.get(roomid);
    }

    JoinNew (conf: IRoomConfig, order: number, userinfo: IUserInfo, callback: NotifyCb) : boolean {
        let id = this.getId();
        this.rooms.set(id, new Room(id, conf));
        let r = this.Join(id, order, userinfo, callback);
        if (r === false) {
            this.rooms.delete(id);
            return false;
        }
        console.log('+ Room ' + id + ' created.');
        return true;
    }

    Join (id: string, order: number, userinfo: IUserInfo, callback: NotifyCb) : boolean {
        let r = this.GetRoom(id);
        if (r === undefined) return false;
        let room = r;
        if (order == -2) {
            let ss = Util.range(room.num).filter(i => room.seats[i].empty());
            if (ss.length == 0) return false;
            order = ss[Util.randomIn(ss.length)];
        }
        if (order >= room.num || (order >= 0 && !room.seats[order].empty())) return false;
        room.join(order, userinfo, callback);
        console.log('  Room ' + room.id + ' has new user ' + userinfo.name + '.');
        return true;
    }

    Exit (userid: string, roomid: string) : void {
        let room = this.rooms.get(roomid);
        if (room === undefined) return;
        room.exit(userid);
        if (room.seats.every(s => s.empty())) {
            this.rooms.delete(roomid);
            console.log('- Room ' + roomid + ' destroyed.');
        }
    }

    Disconnect (userid: string, roomid: string) : void {
        // TODO
        let room = this.rooms.get(roomid);
        if (! room) return;
        room.Disconnect(userid);
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
