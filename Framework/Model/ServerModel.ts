// ServerModel.ts
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

/// <reference path="../Auth/User.ts" />
/// <reference path="GlobalModel.ts" />
/// <reference path="IModelSide.ts" />
/// <reference path="ModelBase.ts" />
/// <reference path="ModelList.ts" />
/// <reference path="UserModel.ts" />

namespace Framework.Model {
    import User = Framework.Auth.User;

    export class ServerModel<TGlobal extends GlobalModel, TUser extends UserModel> extends ModelBase implements IModelSide<TGlobal, TUser> {
        public global: TGlobal;
        public users: ModelList<TUser>;
        private TUserClass: any;
        private filename: string;

        public saveModel() {
            if ( this.filename ) {
                let w: any = window;
                w.writeFile(this.filename, this.save());
            }
        }

        public saveModelOnChange() {
            this.addEventListener("change", () => this.saveModel());
        }

        public saveModelEvery(millis: number) {
            setInterval(() => this.saveModel(), millis);
        }

        public addUser(user: User) {
            let model: TUser = new this.TUserClass();
            model.user = user;
            this.users.push(model);
        }

        public constructor(TGlobal: any, TUser: any, filename?: string) {
            super();
            this.global = new TGlobal();
            this.users = new ModelList<TUser>(TUser);
            this.TUserClass = TUser;
            this.initField(this.global, "global");
            this.initField(this.users, "users");
            if ( filename ) {
                let w: any = window;
                let saved: string = w.readFile(filename);
                if ( saved ) {
                    this.load(JSON.parse(saved));
                }
                this.filename = filename;
            }
        }
    }
}
