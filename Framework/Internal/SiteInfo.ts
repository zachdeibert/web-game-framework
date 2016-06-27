// SiteInfo.ts
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
/// <reference path="LoadError.ts" />

namespace Framework.Internal {
    import EventDispatcher = Framework.EventDispatcher;

    export class SiteInfo extends EventDispatcher {
        private xmlhttp: XMLHttpRequest;
        public title: string;
        public main: string;

        public pull(): void {
            this.xmlhttp.send();
        }

        public constructor() {
            super();
            if ( window.hasOwnProperty("XMLHttpRequest") ) {
                this.xmlhttp = new XMLHttpRequest();
            } else if ( window.hasOwnProperty("ActiveXObject") ) {
                this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            } else {
                throw new LoadError("Unable to find XMLHttpRequest class");
            }
            this.xmlhttp.open("GET", "site.json", true);
            this.xmlhttp.addEventListener("readystatechange", () => {
                if ( this.xmlhttp.readyState == 4 ) {
                    if ( this.xmlhttp.status == 200 ) {
                        let json = JSON.parse(this.xmlhttp.responseText);
                        this.title = json.title;
                        this.main = json.main;
                        this.dispatchEvent(new Event("load"));
                    } else {
                        throw new LoadError("Unable to get site information");
                    }
                }
            });
        }
    }
}
