export default interface IGameVM {
    Start (): void;
    Update (operation: object): void;
    InitStatus (obj: object): void;
}