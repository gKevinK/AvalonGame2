export default interface IGameMachine {
    NotifyCallback : {(nums: Array<number>, msg: object) : void};
    Start() : void;
    Operate(num: number, operation: object) : boolean;
    GetStatus(num: number) : object;
}
