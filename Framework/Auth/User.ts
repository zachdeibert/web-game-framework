// User.ts
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

namespace Framework.Auth {
    export class User {
        public static alphabet: string = "abcdegfhjiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        public static tokenLength: number = 32;
        public name: string;
        public id: string;
        public token: string;

        public regenerateToken() {
            let a: string[] = [];
            for ( var i: number = 0; i < User.tokenLength; ++i ) {
                a.push(User.alphabet[Math.floor(Math.random() * User.alphabet.length)]);
            }
            this.token = a.join("");
        }

        public constructor(name?: string, id?: string, token?: string | boolean) {
            this.name = name;
            this.id = id;
            if ( token ) {
                if ( typeof(token) == "string" ) {
                    this.token = token as string;
                } else {
                    this.regenerateToken();
                }
            }
        }
    }
}
