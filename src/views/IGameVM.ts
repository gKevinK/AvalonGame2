export default interface IGameVM {
    Start (): void;
    Operate (operation: object): void;
    InitStatus (obj: object): void;
}