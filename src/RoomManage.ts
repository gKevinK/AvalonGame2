import IGameMachine from './IGameMachine'

export class Room
{
    id: string;
    machine: IGameMachine;
    
    constructor (id: string) {
    
    }
}

export default class RoomManager
{
    rooms: MapConstructor;
}