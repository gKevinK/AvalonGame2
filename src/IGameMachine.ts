export default interface IGameMachine {
    NotifyCallback : {(nums: Array<number>, msg: object) : void};
    Start() : void;
    Operate(num: number, operation: { op: string }) : boolean;
    GetStatus(num: number) : object;
}
