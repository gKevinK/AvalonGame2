import IGameMachine from './IGameMachine'
import Machine from './AvalonMachine'

const Util = {
    range: function (n: number) {
        return [...Array(n).keys()];
    },

    randomIn: function (n: number) {
        return Math.floor(n * Math.random());
    }
};

class Seat
{
    name: string = undefined;
    private msgs: object[] = [];
    private NotifyCallback: (type: string, msg: object) => void = undefined;

    sit (name: string, callback: (type: string, msg: object) => void): void {
        this.name = name;
        this.NotifyCallback = callback;
        this.msgs.forEach(m => {
            this.NotifyCallback('msg', m);
        });
    }

    empty (): boolean {
        return this.NotifyCallback === undefined;
    }

    message (msg: { order: number, text: string }): void {
        this.msgs.push(msg);
        this.NotifyCallback('msg', msg);
    }

    notify (type: string, msg: object): void {
        if (this.NotifyCallback)
            this.NotifyCallback(type, msg);
    }

    leave (): void {
        this.NotifyCallback('exit', undefined);
        this.NotifyCallback = undefined;
    }
}

export class Room
{
    id: string;
    num: number;
    machine: IGameMachine;
    seats: Seat[];
    
    constructor (id: string, num: number) {
        this.id = id;
        this.num = num;
        this.seats = Util.range(num).map(_ => new Seat());
    }

    private start () {
        this.machine = new Machine(this.num);
        this.machine.NotifyCallback = (ids, obj) => this.notify(ids, obj);
        this.machine.Start();
    }

    private notify (ids: Array<number>, obj: object) : void {
        if (ids.length == 0) {
            ids = Util.range(this.num).map((v, i) => i);
        }
        ids.forEach(i => {
            this.seats[i].notify('update', obj);
        });
    }

    join (n: number, name: string, callback: (type: string, msg: object) => void) : void {
        let seat = this.seats[n];
        seat.sit(name, callback);
        seat.notify('join', { room_id: this.id, order: n });
        this.seats.forEach(s => s.notify('room', { type: 'join-i', order: n, name: name }));
        if (this.machine)
            seat.notify('op', { type: 'status', names: this.seats.map(s => s.name), status: this.machine.GetStatus(n) });
        if (! this.machine && this.seats.every(s => !s.empty()))
            this.start();
    }

    operate (n: number, op: string) : boolean {
        return this.machine.Operate(n, JSON.parse(op));
    }

    

    message (n: number, msg: string) : void {
        this.seats.forEach(s => s.message({ order: n, text: msg }));
    }

    exit (n: number) : void {
        this.seats.forEach(s => s.notify('room', { type: 'exit-i', order: n }));
        this.seats[n].leave();
    }
}

export default class RoomManager
{
    private rooms: Map<string, Room>;

    constructor() {
        this.rooms = new Map<string, Room>();
    }

    GetRoom (id: string) : Room {
        return this.rooms.get(id);
    }

    JoinNew (player_num: number, order: number, name: string, callback: (type: string, msg: object) => void) : boolean {
        let id = this.getId();
        this.rooms.set(id, new Room(id, player_num));
        console.log('+ Room ' + id + ' created.');
        let r = this.Join(id, order, name, callback);
        if (r == false) {
            this.rooms.delete(id);
            return false;
        }
        return true;
    }

    Join (id: string, order: number, name: string, callback: (type: string, msg: object) => void) : boolean {
        if (! this.rooms.has(id)) return false;
        let room = this.GetRoom(id);
        if (order == -1) {
            let ss = room.seats.filter(s => s.empty());
            if (ss.length == 0) return false;
            order = room.seats.indexOf(ss[Util.randomIn(ss.length)]);
        }
        if (name.length < 4 || order >= room.num || !room.seats[order].empty()) return false;
        room.join(order, name, callback);
        console.log('  Room ' + room.id + ' has new user ' + name + '.');
        return true;
    }

    GetStatus (id: string, order: number) : object {
        // TODO
        return {
            room_id: id,
            order: order,
            room_info: null,
            game_info: null,
        };
    }

    Exit (id: string, order: number) : void {
        if (! this.rooms.has(id)) return;
        this.GetRoom(id).exit(order);
        if (this.GetRoom(id).seats.every(s => s.empty())) {
            this.rooms.delete(id);
            console.log('- Room ' + id + ' destroyed.');
        }
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
