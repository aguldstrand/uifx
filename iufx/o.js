///<Reference path="IDestructable.ts" />
var uifx;
(function (uifx) {
    var addEventListener = window.addEventListener ? function (el, event, handler) {
        return el.addEventListener(event, handler, false);
    } : function (el, event, handler) {
        return (el).attachEvent(event, handler);
    };

    var removeEventListener = window.removeEventListener ? function (el, event, handler) {
        return el.removeEventListener(event, handler, false);
    } : function (el, event, handler) {
        return (el).detachEvent(event, handler);
    };

    function bind(func, scope) {
        return function () {
            return func.apply(scope, arguments);
        };
    }

    var Component = (function () {
        function Component(el, template, eventHandlers) {
            this.template = template;
            this.eventHandlers = eventHandlers;
            this.el = el || document;
            this.components = {};
            this.componentInstances = null;
        }
        Component.prototype.addComponent = function (selector, component) {
            this.components[selector] = component;
        };

        Component.prototype.initialize = function () {
            this.initComponents();
            this.bindEventHandlers();
        };

        Component.prototype.initComponents = function () {
            this.componentInstances = {};
            for (var selector in this.components) {
                if (this.components.hasOwnProperty(selector)) {
                    var ctor = this.components[selector];
                    var instances = this.componentInstances[selector] = [];

                    var elements = this.el.querySelectorAll(selector);
                    var len = elements.length;
                    for (var i = 0; i < len; i++) {
                        var el = elements[i];
                        instances.push(new ctor((el)));
                    }
                }
            }
        };

        Component.prototype.bindEventHandlers = function () {
            if (this.eventHandlers) {
                this.boundHandlers = [];
                for (var selector in this.eventHandlers) {
                    if (this.eventHandlers.hasOwnProperty(selector)) {
                        var handlerInfos = this.eventHandlers[selector];

                        var elements = this.el.querySelectorAll(selector);

                        var elLen = elements.length;
                        for (var i = 0; i < elLen; i++) {
                            var el = elements[i];

                            var handlerInfoLen = handlerInfos.length;
                            for (var j = 0; j < handlerInfoLen; j++) {
                                var handlerInfo = handlerInfos[j];
                                var handler = bind(handlerInfo.handler, this);
                                this.boundHandlers.push({
                                    el: el,
                                    event: handlerInfo.event,
                                    handler: handler
                                });
                                addEventListener(el, handlerInfo.event, handler);
                            }
                        }
                    }
                }
            }
        };

        Component.prototype.destroy = function () {
            this.destroyComponent();
            this.unbindEventHandlers();
        };

        Component.prototype.unbindEventHandlers = function () {
            if (this.boundHandlers) {
                var len = this.boundHandlers.length;
                for (var i = 0; i < len; i++) {
                    var boundHandler = this.boundHandlers[i];
                    removeEventListener(boundHandler.el, boundHandler.event, boundHandler.handler);
                }
                this.boundHandlers = null;
            }
        };

        Component.prototype.destroyComponent = function () {
            for (var selector in this.componentInstances) {
                if (this.components.hasOwnProperty(selector)) {
                    var instances = this.componentInstances[selector];
                    var len = instances.length;
                    for (var i = 0; i < len; i++) {
                        instances[i].destroy();
                    }
                }
            }
            this.componentInstances = null;
        };
        return Component;
    })();
    uifx.Component = Component;
})(uifx || (uifx = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<Reference path="Component.ts" />
var uifx;
(function (uifx) {
    var Application = (function (_super) {
        __extends(Application, _super);
        function Application(eventHandlers) {
            _super.call(this, null, null, eventHandlers);
        }
        return Application;
    })(uifx.Component);
    uifx.Application = Application;
})(uifx || (uifx = {}));
