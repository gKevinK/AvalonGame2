import IGameMachine from './IGameMachine'
import AvalonMachine from './AvalonMachine'

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

    private start() {
        this.machine = new AvalonMachine(this.num);
        this.machine.Start();
    }

    join () : boolean {
        return false;
    }

    operate (op: string) : boolean {
        return this.machine.Operate(0, JSON.parse(op));
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