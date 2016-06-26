namespace Framework.Graphics {
    export class FontFamily {
        public static caption: FontFamily = new FontFamily("caption");
        public static icon: FontFamily = new FontFamily("icon");
        public static menu: FontFamily = new FontFamily("manu");
        public static messageBox: FontFamily = new FontFamily("message-box");
        public static smallCaption: FontFamily = new FontFamily("small-caption");
        public static statusBar: FontFamily = new FontFamily("status-bar");
        private value: string;

        public toString() {
            return this.value;
        }

        public constructor(val: string) {
            this.value = val;
        }
    }
}
