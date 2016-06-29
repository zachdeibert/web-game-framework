// DOMEvents.ts
//
// Copyright (c) 2016 Zach Deibert
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

/// <reference path="Component.ts" />
/// <reference path="Point.ts" />
/// <reference path="Rectangle.ts" />

namespace Framework.Graphics {
    export class DOMEvents {
        private c: Component;

        public static DOMCollector(type: string, l: EventListener | EventListenerObject, element?: HTMLElement) {
            element.addEventListener(type, l);
        }

        public static mouseComparator(e: Event, c: Component): boolean {
            let m: MouseEvent = e as MouseEvent;
            let b: Rectangle = c.getBounds();
            return b.contains(new Point(m.clientX, m.clientY));
        }

        public static mouseOverComparator(e: Event, c: Component): boolean {
            let m: MouseEvent = e as MouseEvent;
            let b: Rectangle = c.getBounds();
            return b.contains(new Point(m.clientX, m.clientY)) && !b.contains(new Point(m.clientX - m.movementX, m.clientY - m.movementY));
        }

        public static mouseOutComparator(e: Event, c: Component): boolean {
            let m: MouseEvent = e as MouseEvent;
            let b: Rectangle = c.getBounds();
            return !b.contains(new Point(m.clientX, m.clientY)) && b.contains(new Point(m.clientX - m.movementX, m.clientY - m.movementY));
        }

        public static touchComparator(e: Event, c: Component): boolean {
            let t: TouchEvent = e as TouchEvent;
            let b: Rectangle = c.getBounds();
            for ( var i: number = 0; i < t.touches.length; ++i ) {
                let touch: Touch = t.touches.item(i);
                if ( b.contains(new Point(touch.clientX, touch.clientY)) ) {
                    return true;
                }
            }
            return false;
        }

        public static focusComparator(e: Event, c: Component): boolean {
            return c.isFocused();
        }

        public static trueComparator(e: Event, c: Component): boolean {
            return true;
        }

        private _(type: string, comparator: string, name: string = type) {
            let cls: any = DOMEvents;
            this.c.initEvent(name, cls[comparator + "Comparator"], (_: string, l: EventListener | EventListenerObject, element?: HTMLElement) => element.addEventListener(type, l));
        }

        public afterPrint() {
            this._("afterprint", "true");
        }

        public beforePrint() {
            this._("beforeprint", "true");
        }

        public beforeUnload() {
            this._("beforeunload", "true");
        }

        public error() {
            this._("error", "true");
        }

        public hashChange() {
            this._("hashchange", "true");
        }

        public load() {
            this._("load", "true");
        }

        public message() {
            this._("message", "true");
        }

        public offline() {
            this._("offline", "true");
        }

        public online() {
            this._("online", "true");
        }

        public pageHide() {
            this._("pagehide", "true");
        }

        public pageShow() {
            this._("pageshow", "true");
        }

        public popState() {
            this._("popstate", "true");
        }

        public resize() {
            this._("resize", "true");
        }

        public storage() {
            this._("storage", "true");
        }

        public unload() {
            this._("unload", "true");
        }

        public keyDown() {
            this._("keydown", "focus");
        }

        public keyPress() {
            this._("keypress", "focus");
        }

        public keyUp() {
            this._("keyup", "focus");
        }

        public click() {
            this._("click", "mouse");
        }

        public dblClick() {
            this._("dblclick", "mouse");
        }

        public drag() {
            this._("drag", "mouse");
        }

        public dragEnd() {
            this._("dragend", "mouse");
        }

        public dragEnter() {
            this._("drag", "mouseOver", "dragenter");
        }

        public dragLeave() {
            this._("drag", "mouseOut", "dragleave");
        }

        public dragOver() {
            this._("drag", "mouseOver", "dragover");
        }

        public dragStart() {
            this._("dragstart", "mouse");
        }

        public drop() {
            this._("drop", "mouse");
        }

        public mouseDown() {
            this._("mousedown", "mouse");
        }

        public mouseMove() {
            this._("mousemove", "mouse");
        }

        public mouseOut() {
            this._("mousemove", "mouseOut", "mouseout");
        }

        public mouseOver() {
            this._("mousemove", "mouseOver", "mouseover");
        }

        public mouseUp() {
            this._("mouseup", "mouse");
        }

        public scroll() {
            this._("scroll", "mouse");
        }

        public wheel() {
            this._("wheel", "mouse");
        }

        public touchStart() {
            this._("touchstart", "touch");
        }

        public touchEnd() {
            this._("touchend", "touch");
        }

        public touchCancel() {
            this._("touchcancel", "touch");
        }

        public touchMove() {
            this._("touchmove", "touch");
        }

        public constructor(c: Component) {
            this.c = c;
        }
    }
}
