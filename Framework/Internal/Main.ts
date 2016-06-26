namespace Framework.Internal {
    export class Main {
        public static main() {
            var info: SiteInfo = new SiteInfo();
            info.addEventListener("load", () => {
                document.title = info.title;
            });
            info.pull();
        }
    }
}
