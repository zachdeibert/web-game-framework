namespace Framework.Internal {
    export class Main {
        public static main() {
            let info: SiteInfo = new SiteInfo();
            info.addEventListener("load", () => {
                document.title = info.title;
            });
            info.pull();
            let screen = new Screen();
            let rotate = document.getElementById("rotate");
            let fullscreen = document.getElementById("enterFullscreen");
            let canvas = document.getElementById("canvas");
            var isFullscreen = false;
            screen.addEventListener("resize", () => {
                rotate.classList.remove("active");
                fullscreen.classList.remove("active");
                canvas.classList.remove("active");
                document.documentElement.classList.remove("scroll");
                if ( !screen.landscape ) {
                    if ( isFullscreen ) {
                        document.documentElement.scrollTop = document.body.scrollTop = 0;
                        isFullscreen = false;
                    }
                    rotate.classList.add("active");
                } else if ( isFullscreen ) {
                    canvas.classList.add("active");
                } else {
                    fullscreen.classList.add("active");
                    document.documentElement.classList.add("scroll");
                }
            });
            window.addEventListener("scroll", () => {
                isFullscreen = document.documentElement.scrollTop >= document.body.clientHeight - window.screen.height || document.body.scrollTop >= document.body.clientHeight - window.screen.height;
                screen.dispatchEvent(new Event("resize"));
            });
            screen.probe();
        }
    }
}
