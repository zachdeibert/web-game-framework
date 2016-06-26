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

        public screenResized() {
            this.rotatePanel.classList.remove("active");
            this.fullscreenPanel.classList.remove("active");
            this.canvasPanel.classList.remove("active");
            document.documentElement.classList.remove("scroll");
            if ( !this.screen.landscape ) {
                if ( this.isFullscreen ) {
                    document.documentElement.scrollTop = document.body.scrollTop = 0;
                    this.isFullscreen = false;
                }
                this.rotatePanel.classList.add("active");
            } else if ( this.isFullscreen ) {
                this.canvasPanel.classList.add("active");
            } else {
                this.fullscreenPanel.classList.add("active");
                document.documentElement.classList.add("scroll");
            }
        }

        public screenScrolled() {
            this.isFullscreen = document.documentElement.scrollTop >= document.body.clientHeight - window.screen.height || document.body.scrollTop >= document.body.clientHeight - window.screen.height;
            this.screenResized();
        }

        public constructor() {
            this.info = new SiteInfo();
            this.info.addEventListener("load", () => {
                document.title = this.info.title;
                let c = new Canvas();
                eval("window." + this.info.main).main(c);
            });
            this.info.pull();
            this.screen = new Screen();
            this.rotatePanel = document.getElementById("rotate");
            this.fullscreenPanel = document.getElementById("enterFullscreen");
            this.canvasPanel = document.getElementById("canvas");
            this.isFullscreen = false;
            this.screen.addEventListener("resize", () => this.screenResized());
            window.addEventListener("scroll", () => this.screenScrolled());
            this.screen.probe();
        }
    }
}
