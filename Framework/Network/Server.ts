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
/// <reference path="../Model/GlobalModel.ts" />
/// <reference path="../Model/ModelChangeEvent.ts" />
/// <reference path="../Model/ServerModel.ts" />
/// <reference path="../Model/UserModel.ts" />
/// <reference path="SocketEvent.ts" />
/// <reference path="INetworkSide.ts" />
/// <reference path="ISocketSendCallback.ts" />

namespace Framework.Network {
    import AuthFactory = Framework.Auth.AuthFactory;
    import EventDispatcher = Framework.EventDispatcher;
    import FrameworkEvent = Framework.FrameworkEvent;
    import GlobalModel = Framework.Model.GlobalModel;
    import IAuth = Framework.Auth.IAuth;
    import ModelChangeEvent = Framework.Model.ModelChangeEvent;
    import ServerModel = Framework.Model.ServerModel;
    import User = Framework.Auth.User;
    import UserModel = Framework.Model.UserModel;

    export class Server extends EventDispatcher implements INetworkSide<ServerModel<GlobalModel, UserModel>> {
        private auth: IAuth;
        private users: User[];
        private socks: ISocketSendCallback[];
        private model: ServerModel<GlobalModel, UserModel>;
        private unregisterModel: () => void;

        public send(data: any) {
            for ( var i: number = 0; i < this.socks.length; ++i ) {
                this.socks[i](data);
            }
        }

        public setModel(model: ServerModel<GlobalModel, UserModel>) {
            if ( this.model ) {
                this.unregisterModel();
            } else {
                this.model = model;
                let userListeners: EventListener[] = [];
                let users: UserModel[] = [];
                let globalListener: EventListener = (ev: FrameworkEvent) => {
                    let e: ModelChangeEvent = ev as ModelChangeEvent;
                    this.send({
                        "type": "model_update",
                        "path": "global." + e.path,
                        "value": e.value
                    });
                };
                let userListener: EventListener = (ev: FrameworkEvent) => {
                    let user: UserModel = (ev as ModelChangeEvent).value;
                    let listener: EventListener = (ev: FrameworkEvent) => {
                        let e: ModelChangeEvent = ev as ModelChangeEvent;
                        this.send({
                            "type": "model_update",
                            "path": "user." + e.path,
                            "value": e.value
                        });
                    };
                    user.addEventListener("change", listener);
                    users.push(user);
                    userListeners.push(listener);
                    let u: any = user;
                    for ( var key in user ) {
                        if ( typeof(u[key]) != "function" ) {
                            u[key] = u[key];
                        }
                    }
                };
                model.global.addEventListener("change", globalListener);
                model.users.addEventListener("insert", userListener);
                this.unregisterModel = () => {
                    model.global.removeEventListener("change", globalListener);
                    model.users.removeEventListener("insert", userListener);
                    while ( users.length > 0 ) {
                        users.pop().removeEventListener("change", userListeners.pop());
                    }
                };
            }
        }

        public sendUser(sock: ISocketSendCallback, model: UserModel | GlobalModel, path: string) {
            let m: any = model;
            for ( var key in model ) {
                if ( typeof(m[key]) != "function" && key != "listeners" && key != "listenerObjects" && key != "parent" && key != "parentName" ) {
                    sock({
                        "type": "model_update",
                        "path": path + "." + key,
                        "value": m[key]
                    });
                }
            }
        }

        public clientMessage(e: SocketEvent) {
            let w: any = window;
            if ( e.data.authToken ) {
                this.auth.serverAuth(w.serverInfo.auth, e.data.authToken, e.send, user => {
                    for ( var i: number = 0; i < this.users.length; ++i ) {
                        if ( this.users[i].id == user.id ) {
                            this.users[i].name = user.name;
                            this.users[i].token = user.token;
                            if ( this.model != null ) {
                                for ( var j: number = 0; j < this.model.users.length; ++j ) {
                                    let model: UserModel = this.model.users.get(j);
                                    if ( model.user == this.users[j] ) {
                                        this.sendUser(e.send, model, "user");
                                        this.sendUser(e.send, this.model.global, "global");
                                    }
                                }
                            }
                            return;
                        }
                    }
                    this.users.push(user);
                    if ( this.model != null ) {
                        this.model.addUser(user);
                    }
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

        public run() {
            let w: any = window;
            eval("global." + w.serverInfo.server).main(this);
        }

        public constructor() {
            super();
            let w: any = window;
            this.auth = AuthFactory.create(w.serverInfo.auth);
            this.socks = [];
            this.users = [];
            this.addEventListener("connect", (e: FrameworkEvent) => this.socks.push((e as SocketEvent).send));
            this.addEventListener("data", (e: FrameworkEvent) => this.clientMessage(e as SocketEvent));
            this.addEventListener("close", (e: FrameworkEvent) => this.socks.splice(this.socks.indexOf((e as SocketEvent).send), 1));
        }
    }
}
