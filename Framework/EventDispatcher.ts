namespace Framework {
    export class EventDispatcher extends Object implements EventTarget {
        private listeners: { [type: string]: Array<EventListener> };
        private listenerObjects: { [type: string]: Array<EventListenerObject> };

        public addEventListener(type: string, listener: EventListener | EventListenerObject, useCapture?: boolean) {
            let obj: any = listener;
            if ( typeof(listener) == "function" ) {
                let func: EventListener = obj;
                if ( this.listeners.hasOwnProperty(type) ) {
                    if ( this.listeners[type].indexOf(func) < 0 ) {
                        this.listeners[type].push(func);
                    }
                } else {
                    this.listeners[type] = [ func ];
                }
            } else {
                let func: EventListenerObject = obj;
                if ( this.listenerObjects.hasOwnProperty(type) ) {
                    if ( this.listenerObjects[type].indexOf(func) < 0 ) {
                        this.listenerObjects[type].push(func);
                    }
                } else {
                    this.listenerObjects[type] = [ func ];
                }
            }
        }

        public dispatchEvent(evt: Event): boolean {
            let oldname = "on" + evt.type;
            if ( this.hasOwnProperty(oldname) ) {
                let obj: any = this;
                let func = obj[oldname];
                if ( typeof(func) == "function" ) {
                    func(evt);
                }
            }
            if ( this.listeners.hasOwnProperty(evt.type) ) {
                this.listeners[evt.type].forEach((v: EventListener) => v(evt));
            }
            if ( this.listenerObjects.hasOwnProperty(evt.type) ) {
                this.listenerObjects[evt.type].forEach((v: EventListenerObject) => v.handleEvent(evt));
            }
            return evt.defaultPrevented;
        }

        public removeEventListener(type: string, listener: EventListener | EventListenerObject, useCapture?: boolean) {
            let list: { [type: string]: Array<EventListener | EventListenerObject> } = typeof(listener) == "function" ? this.listeners : this.listenerObjects;
            if ( list.hasOwnProperty(type) ) {
                list[type] = list[type].filter((v: EventListener | EventListenerObject) => v == listener);
            }
        }

        public constructor() {
            super();
            this.listeners = {};
            this.listenerObjects = {};
        }
    }
}