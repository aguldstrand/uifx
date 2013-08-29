module uifx {
    export class Event<TSender, TParams> {

        private sender: TSender;
        private handlers: {
            handler: { (sender: TSender, params: TParams): void };
            scope: any;
        }[];

        constructor(sender: TSender) {
            this.sender = sender;
        }

        public subscribe(handler: { (sender: TSender, params: TParams): void }, scope: any) {
            this.handlers.push({
                handler: handler,
                scope: scope,
            });
        }

        public unsubscribe(handler: { (sender: TSender, params: TParams): void }) {
            var handlers = this.handlers;

            var len = handlers.length;
            for (var i = 0; i < len; i++) {
                var h = handlers[i];
                if (h.handler === handler) {
                    handlers.splice(i, 1);
                    i--;
                }
            }

            this.handlers = handlers;
        }

        public call(params: TParams) {
            var handlers = this.handlers;

            var len = handlers.length;
            for (var i = 0; i < len; i++) {
                var handler = handlers[i];

                handler.handler.call(handler.scope, this.sender, params);
            }
        }
    }
}
