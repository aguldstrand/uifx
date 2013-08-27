var uifx;
(function (uifx) {
    var Event = (function () {
        function Event(sender) {
            this.sender = sender;
        }
        Event.prototype.subscribe = function (handler, scope) {
            this.handlers.push({
                handler: handler,
                scope: scope
            });
        };

        Event.prototype.unsubscribe = function (handler) {
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
        };

        Event.prototype.call = function (params) {
            var handlers = this.handlers;

            var len = handlers.length;
            for (var i = 0; i < len; i++) {
                var handler = handlers[i];

                handler.handler.call(handler.scope, this.sender, params);
            }
        };
        return Event;
    })();
    uifx.Event = Event;
})(uifx || (uifx = {}));
//# sourceMappingURL=Event.js.map
