namespace Framework {
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
