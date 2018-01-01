import IGameMachine from './IGameMachine';

export default class GomokuMachine implements IGameMachine
{
    NotifyCallback : {(nums: Array<number>, msg: object) : void};

    constructor()
    {
        
    }

    Start() : void
    {
        throw new Error("Method not implemented.");
    }

    Operate(num: number, operation: object) : boolean
    {
        throw new Error("Method not implemented.");
    }

    GetStatus(num: number) : object
    {
        throw new Error("Method not implemented.");
    }
}