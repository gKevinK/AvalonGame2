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
    msgs: String[] = [];
    NotifyCallback: (msg: String) => void;

    sit (callback: (msg: String) => void): void {
        this.NotifyCallback = callback;
        this.msgs.forEach(m => {
            this.NotifyCallback(m);
        });
    }

    chat (msg: object): void {
        let m = JSON.stringify(msg);
        this.msgs.push(m);
        this.NotifyCallback(m);
    }

    notify (msg: object): void {
        this.NotifyCallback(JSON.stringify(msg));
    }

    leave (): void {
        this.NotifyCallback = null;
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
        this.seats = new Array(num).map(() => new Seat());
    }

    private start () {
        this.machine = new Machine(this.num);
        this.machine.NotifyCallback = (ids, obj) => this.notify(ids, obj);
        this.machine.Start();
    }

    private notify (ids: Array<number>, obj: object) : void {
        if (ids.length == 0) {
            ids = new Array(this.num).map((v, i) => i);
        }
        ids.forEach(i => {
            this.seats[i].notify(obj);
        });
    }

    join () : boolean {
        return false;
    }

    operate (op: string) : boolean {
        return this.machine.Operate(0, JSON.parse(op));
    }

    message (msg: string) : void {

    }

    exit () : void {
        
    }
}

export default class RoomManager
{
    rooms: Map<string, Room>;

    constructor() {
        this.rooms = new Map<string, Room>();
    }

    GetRoom (id: string) : Room {
        return this.rooms[id];
    }

    JoinNew (player_num: number, order: number) : boolean {
        let id = this.getId();
        // this.rooms[id] = new Room(id, );
        return true;
    }

    Join (id: string) : boolean {
        return false;
    }

    Exit (id: string) : void {

    }

    private getId(): string {
        // TODO: Dynamic range
        while (true) {
            let k = Math.floor(Math.random() * 10000).toString();
            if (! this.rooms.has(k)) {
                return k;
            }
        }
    }
}
