import IGameMachine from './IGameMachine'
import Machine from './AvalonMachine'

class Seat
{

}

export class Room
{
    id: string;
    num: number;
    machine: IGameMachine;
    
    constructor (id: string, num: number) {
        this.id = id;
        this.num = num;
    }

    private start () {
        this.machine = new Machine(this.num);
        this.machine.NotifyCallback = (ids, obj) => { this.notify(ids, obj) };
        this.machine.Start();
    }

    private notify (ids: Array<number>, obj: object) : void {

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

    NewRoom () : string {

        return 'id';
    }

    Join (id: string) : boolean {
        return false;
    }

    Exit (id: string) : void {

    }
}