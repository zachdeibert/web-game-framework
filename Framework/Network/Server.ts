// Server.ts
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

/// <reference path="../Auth/AuthFactory.ts" />
/// <reference path="../Auth/IAuth.ts" />
/// <reference path="../Auth/User.ts" />
/// <reference path="../EventDispatcher.ts" />
/// <reference path="../FrameworkEvent.ts" />
/// <reference path="SocketEvent.ts" />
/// <reference path="ISocketSendCallback.ts" />

namespace Framework.Network {
    import AuthFactory = Framework.Auth.AuthFactory;
    import EventDispatcher = Framework.EventDispatcher;
    import FrameworkEvent = Framework.FrameworkEvent;
    import IAuth = Framework.Auth.IAuth;
    import User = Framework.Auth.User;

    export class Server extends EventDispatcher {
        private auth: IAuth;
        private users: User[];

        public clientMessage(e: SocketEvent) {
            let w: any = window;
            if ( e.data.authToken ) {
                this.auth.serverAuth(w.serverInfo.auth, e.data.authToken, e.send, user => {
                    this.users.push(user);
                    console.log("Authenticated " + user.name);
                });
            } else if ( e.data.type == "get_user" && e.data.token ) {
                for ( var i: number = 0; i < this.users.length; ++i ) {
                    if ( this.users[i].token == e.data.token ) {
                        e.send({
                            "type": "authentication_success",
                            "user": this.users[i]
                        });
                        return;
                    }
                }
                e.send({
                    "type": "authentication_failure"
                });
            }
        }

        public constructor() {
            super();
            let w: any = window;
            this.auth = AuthFactory.create(w.serverInfo.auth);
            this.users = [];
            this.addEventListener("data", (e: FrameworkEvent) => this.clientMessage(e as SocketEvent));
        }
    }
}
