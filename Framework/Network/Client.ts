// Client.ts
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

/// <reference path="../EventDispatcher.ts" />

namespace Framework.Network {
    import EventDispatcher = Framework.EventDispatcher;

    export class Client extends EventDispatcher {
        private sock: WebSocket;

        public ensureOpen(callback?: () => void) {
            if ( this.sock == null || (this.sock.readyState != WebSocket.CONNECTING && this.sock.readyState != WebSocket.OPEN) ) {
                this.sock = new WebSocket("ws://" + location.hostname + "/", "web-game-framework");
                this.sock.addEventListener("close", e => this.dispatchEvent(e));
                this.sock.addEventListener("error", e => this.dispatchEvent(e));
                this.sock.addEventListener("message", e => this.dispatchEvent(new SocketEvent("message", (data: any) => this.send(data), location.hostname, JSON.parse(e.data))));
                this.sock.addEventListener("open", e => this.dispatchEvent(e));
            }
            if ( callback ) {
                if ( this.sock.readyState == WebSocket.OPEN ) {
                    callback();
                } else {
                    let listener: EventListener = e => {
                        this.sock.removeEventListener("open", listener);
                        callback();
                    };
                    this.sock.addEventListener("open", listener);
                }
            }
        }

        public send(data: any) {
            this.ensureOpen(() => this.sock.send(JSON.stringify(data)));
        }

        public addEventListener(type: string, listener: EventListener | EventListenerObject, useCapture?: boolean) {
            super.addEventListener(type, listener, useCapture);
            this.ensureOpen();
        }
    }
}
