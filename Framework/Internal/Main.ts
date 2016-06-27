/// <reference path="../Graphics/Dimension.ts" />
/// <reference path="../Graphics/Label.ts" />
/// <reference path="../Graphics/Point.ts" />
/// <reference path="../Graphics/Rectangle.ts" />
/// <reference path="../Graphics/Screen.ts" />
/// <reference path="Canvas.ts" />
/// <reference path="SiteInfo.ts" />

namespace Framework.Internal {
    import Dimension = Framework.Graphics.Dimension;
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
                eval("window." + this.info.main).main(this.canvas);
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
