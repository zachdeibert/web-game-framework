// Main.ts
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
/// <reference path="../Graphics/Dimension.ts" />
/// <reference path="../Graphics/Label.ts" />
/// <reference path="../Graphics/Point.ts" />
/// <reference path="../Graphics/Rectangle.ts" />
/// <reference path="../Graphics/Screen.ts" />
/// <reference path="../Network/Client.ts" />
/// <reference path="Canvas.ts" />
/// <reference path="SiteInfo.ts" />

namespace Framework.Internal {
    import AuthFactory = Framework.Auth.AuthFactory;
    import Client = Framework.Network.Client;
    import Dimension = Framework.Graphics.Dimension;
    import IAuth = Framework.Auth.IAuth;
    import Label = Framework.Graphics.Label;
    import Point = Framework.Graphics.Point;
    import Rectangle = Framework.Graphics.Rectangle;
    import Screen = Framework.Graphics.Screen;

    export class Main {
        private info: SiteInfo;
        private screen: Screen;
        private rotatePanel: HTMLElement;
        private fullscreenPanel: HTMLElement;
        private canvasPanel: HTMLElement;
        private isFullscreen: boolean;
        private canvas: Canvas;
        private auth: IAuth;

        public screenResized() {
            this.canvas.resetBounds();
        }

        public screenChanged() {
            if ( !this.screen.landscape ) {
                if ( this.isFullscreen ) {
                    document.documentElement.scrollTop = document.body.scrollTop = 0;
                    this.isFullscreen = false;
                }
                this.fullscreenPanel.classList.remove("active");
                this.canvasPanel.classList.remove("active");
                this.rotatePanel.classList.add("active");
            } else if ( this.isFullscreen ) {
                this.canvasPanel.classList.add("active");
                this.screenResized();
            } else {
                this.rotatePanel.classList.remove("active");
                this.canvasPanel.classList.remove("active");
                this.fullscreenPanel.classList.add("active");
            }
        }

        public screenScrolled() {
            let target: number = (this.fullscreenPanel.clientHeight - screen.height) / 2;
            this.isFullscreen = document.documentElement.scrollTop >= target || document.body.scrollTop >= target;
            this.screenChanged();
        }

        public constructor() {
            this.info = new SiteInfo();
            this.info.addEventListener("load", () => {
                document.title = this.info.title;
                let sock: Client = new Client();
                if ( this.info.auth ) {
                    this.auth = AuthFactory.create(this.info.auth);
                } else {
                    this.auth = null;
                }
                if ( this.auth != null ) {
                    this.auth.clientAuth(this.info.auth, sock, user => {
                        console.log("Authenticated " + user.name);
                        eval("window." + this.info.main).main(this.canvas, sock, user);
                    });
                }
                eval("window." + this.info.main).main(this.canvas, sock);
            });
            this.info.pull();
            this.screen = new Screen();
            this.rotatePanel = document.getElementById("rotate");
            this.fullscreenPanel = document.getElementById("enterFullscreen");
            this.canvasPanel = document.getElementById("canvas");
            this.isFullscreen = false;
            this.canvas = new Canvas();
            this.screenResized();
            this.screen.addEventListener("resize", () => this.screenChanged());
            window.addEventListener("resize", () => this.screenResized());
            window.addEventListener("scroll", (e: UIEvent) => {
                this.screenScrolled();
                e.preventDefault();
            });
            this.screen.probe();
        }
    }
}
