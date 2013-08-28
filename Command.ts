///<Reference path="ILockModel.ts" />
module uifx {
    export class Command {
        constructor(private lockLevel: number, private lockModel: ILockModel) {
        }

        public execute(input: any) {
            this.lockModel.lock(this.lockLevel);
        }

        public complete(error: any, result: any) {
            this.lockModel.unlock(this.lockLevel);
        }
    }
}