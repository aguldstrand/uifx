///<Reference path="IDestructable.ts" />
module uifx {

    export class Component implements IDestructable {

        private el: Element;
        private components: ComponentDictionary;
        private componentInstances: ComponentInstanceDictionary;
        private boundHandlers: { el: Element; event: string; handler: (e: any) => any; capture: boolean;}[];

        constructor(
            el: Element,
            private template: (model: any) => string,
            private eventHandlers: EventHandlerDictionary) {

            this.el = el || window.document.body;
            this.components = {};
            this.componentInstances = null;
        }

        public addComponent(selector: string, component: new (el: Element) => Component) {
            this.components[selector] = component;
        }

        public initialize() {
            this.initComponents();
            this.bindEventHandlers();
        }

        private initComponents() {
            this.componentInstances = {};
            for (var selector in this.components) {
                if (this.components.hasOwnProperty(selector)) {
                    var ctor = this.components[selector];
                    var instances = this.componentInstances[selector] = [];

                    var elements = this.el.querySelectorAll(selector);
                    var len = elements.length;
                    for (var i = 0; i < len; i++) {
                        var el = elements[i];
                        instances.push(new ctor(<Element>(el)));
                    }
                }
            }
        }

        private bindEventHandlers() {
            if (this.eventHandlers) {
                this.boundHandlers = [];
                for (var selector in this.eventHandlers) {
                    if (this.eventHandlers.hasOwnProperty(selector)) {
                        var handlerInfos = this.eventHandlers[selector];

                        var elements = this.el.querySelectorAll(selector);

                        var elLen = elements.length;
                        for (var i = 0; i < elLen; i++) {
                            var el = <Element>elements[i];

                            var handlerInfoLen = handlerInfos.length;
                            for (var j = 0; j < handlerInfoLen; j++) {
                                var handlerInfo = handlerInfos[j];
                                var handler = bind(handlerInfo.handler, this);
                                this.boundHandlers.push({
                                    el: el,
                                    event: handlerInfo.event,
                                    handler: handler,
                                    capture:handlerInfo.capture
                                });
                                addEventListener(el, handlerInfo.event, handler, !!handlerInfo.capture);
                            }
                        }
                    }
                }
            }
        }

        public destroy() {
            this.destroyComponents();
            this.unbindEventHandlers();
        }

        private unbindEventHandlers() {
            if (this.boundHandlers) {
                var len = this.boundHandlers.length;
                for (var i = 0; i < len; i++) {
                    var boundHandler = this.boundHandlers[i];
                    removeEventListener(boundHandler.el, boundHandler.event, boundHandler.handler, boundHandler.capture);
                }
                this.boundHandlers = null;
            }
        }

        private destroyComponents() {
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
        }
    }

    var addEventListener = window.addEventListener ?
        (el: Element, event: string, handler: (e: any) => any, capture: boolean) => el.addEventListener(event, handler, capture) :
        (el: Element, event: string, handler: (e: any) => any, capture: boolean) => (<HTMLElement>el).attachEvent(event, handler);

    var removeEventListener = window.removeEventListener ?
        (el: Element, event: string, handler: (e: any) => any, capture: boolean) => el.removeEventListener(event, handler, capture) :
        (el: Element, event: string, handler: (e: any) => any, capture: boolean) => (<HTMLElement>el).detachEvent(event, handler);

    var bind = (func, scope) =>
        () => func.apply(scope, arguments);

    export interface EventHandlerDictionary {
        [selector: string]: {
            event: string;
            handler: (e: any) => any;
            lockLevel?: number;
            capture?: boolean;
        }[];
    }

    interface ComponentDictionary {
        [selector: string]: new (el: Element) => Component;
    }

    interface ComponentInstanceDictionary {
        [selector: string]: Component[];
    }
}