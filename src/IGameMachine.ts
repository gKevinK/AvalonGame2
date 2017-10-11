export default interface IGameMachine {
    NotifyCallback : {(orders: Array<number>, msg: object) : void};
    Start() : void;
    Operate(order: number, operation: { op: string }) : boolean;
    GetStatus(order: number) : object;
}
