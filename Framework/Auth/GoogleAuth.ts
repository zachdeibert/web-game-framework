// GoogleAuth.ts
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

/// <reference path="../FrameworkEvent.ts" />
/// <reference path="../Network/Client.ts" />
/// <reference path="../Network/ISocketSendCallback.ts" />
/// <reference path="../Network/SocketEvent.ts" />
/// <reference path="IAuth.ts" />
/// <reference path="IAuthenticationCallback.ts" />
/// <reference path="User.ts" />

namespace Framework.Auth {
    import Client = Framework.Network.Client;
    import FrameworkEvent = Framework.FrameworkEvent;
    import ISocketSendCallback = Framework.Network.ISocketSendCallback;
    import SocketEvent = Framework.Network.SocketEvent;

    export class GoogleAuth implements IAuth {
        public startOAuth(config: any) {
            location.href = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${config.clientID}&redirect_uri=${config.domain}&scope=https://www.googleapis.com/auth/plus.me`;
        }

        public clientAuth(config: any, sock: Client, callback: IAuthenticationCallback): void {
            let storage: any = localStorage;
            let listener: EventListener = (ev: FrameworkEvent) => {
                let e: SocketEvent = ev as SocketEvent;
                if ( e.data.type ) {
                    if ( e.data.type == "authentication_success" ) {
                        sock.removeEventListener("message", listener);
                        storage.auth_google_token = e.data.user.token;
                        callback(new User(e.data.user.name, e.data.user.id, e.data.user.token));
                    } else if ( e.data.type == "authentication_failure" ) {
                        sock.removeEventListener("message", listener);
                        storage.removeItem("auth_google_token");
                        this.clientAuth(config, sock, callback);
                    }
                }
            };
            sock.addEventListener("message", listener);
            if ( storage.auth_google_token ) {
                sock.send({
                    "type": "get_user",
                    "token": storage.auth_google_token
                });
            } else if ( storage.auth_google_tmpCode ) {
                sock.send({
                    "authToken": storage.auth_google_tmpCode
                });
                storage.removeItem("auth_google_tmpCode");
            } else {
                if ( location.search == "" ) {
                    this.startOAuth(config);
                }
                let vars: string[] = location.search.substr(1).split('&');
                let code: string;
                for ( var i: number = 0; i < vars.length; ++i ) {
                    var fields: string[] = vars[i].split('=');
                    if ( fields[0] == "code" ) {
                        code = fields[1];
                        break;
                    }
                }
                if ( code ) {
                    storage.auth_google_tmpCode = code;
                    history.back();
                } else {
                    this.startOAuth(config);
                }
            }
        }

        public serverAuth(config: any, token: string, sock: ISocketSendCallback, callback: IAuthenticationCallback): void {
            let w: any = window;
            w.request({
                "protocol": "https:",
                "hostname": "www.googleapis.com",
                "path": "/oauth2/v4/token",
                "method": "POST",
                "headers": {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }, {
                "code": token,
                "client_id": w.serverInfo.auth.clientID,
                "client_secret": w.serverInfo.auth.secret,
                "redirect_uri": w.serverInfo.auth.domain,
                "grant_type": "authorization_code"
            }, (data: any) => {
                if ( data && data.access_token ) {
                    w.request({
                        "protocol": "https:",
                        "hostname": "www.googleapis.com",
                        "path": "/oauth2/v2/userinfo?access_token=" + data.access_token
                    }, null, (data: any) => {
                        let user: User = new User(data.name, data.id, true);
                        sock({
                            "type": "authentication_success",
                            "user": user
                        });
                        callback(user);
                    });
                }
            });
        }
    }
}
