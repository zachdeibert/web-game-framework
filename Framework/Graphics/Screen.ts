// Screen.ts
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

namespace Framework.Graphics {
    import EventDispatcher = Framework.EventDispatcher;

    export class Screen extends EventDispatcher {
        public width: number;
        public height: number;
        public mobile: boolean;
        public landscape: boolean;

        public probe() {
            let oldWidth = this.width;
            let oldHeight = this.height;
            this.width = screen.availWidth;
            this.height = screen.availHeight;
            this.mobile = window.hasOwnProperty("orientation") && window.orientation != null;
            this.landscape = this.mobile ? parseInt(window.orientation.toString()) % 180 != 0 : this.width > this.height;
            this.dispatchEvent(new Event("resize"));
        }

        public constructor() {
            super();
            this.probe();
            window.addEventListener("orientationchange", () => this.probe());
            document.addEventListener("resize", () => this.probe());
        }
    }
}
