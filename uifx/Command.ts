///<Reference path="ILockModel.ts" />
module uifx {
    export class Command {
        constructor(private timeout: number, private lockLevel: number, private lockModel: ILockModel) {
        }


        public execute(input) {
            this.lock();
            var canceled = false;

            if (this.timeout) {
                var timerHandle = setTimeout(() => {
                    canceled = true;
                    this.unlock();
                }, this.timeout);
            }

            this.executeImpl(input, (err, data) => {
                if (!canceled) {
                    clearTimeout(timerHandle);
                    this.complete(err, data);
                }
            });
        }

        public complete(err, data) {
            this.completeImpl(err, data);
            this.unlock();
        }


        private lock() {
            if (this.lockModel) {
                this.lockModel.lock(this.lockLevel);
            }
        }

        private unlock() {
            if (this.lockModel) {
                this.lockModel.unlock(this.lockLevel);
            }
        }


        public executeImpl(input, callback: (err, data) => void) {
            throw "Not implemented";
        }

        public completeImpl(err, data) {
            throw "Not implemented";
        }
    }
}