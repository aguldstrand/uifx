module uifx {
    export interface ILockModel {
        lock(level: number): void;
        unlock(level: number): void;
        level(): number;
    }
}