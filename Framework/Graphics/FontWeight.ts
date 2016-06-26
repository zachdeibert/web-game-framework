namespace Framework.Graphics {
    export class FontWeight {
        public static normal: FontWeight = new FontWeight("normal");
        public static bold: FontWeight = new FontWeight("bold");
        public static bolder: FontWeight = new FontWeight("bolder");
        public static light: FontWeight = new FontWeight("lighter");
        public static w100: FontWeight = new FontWeight("100");
        public static w200: FontWeight = new FontWeight("200");
        public static w300: FontWeight = new FontWeight("300");
        public static w400: FontWeight = new FontWeight("400");
        public static w500: FontWeight = new FontWeight("500");
        public static w600: FontWeight = new FontWeight("600");
        public static w700: FontWeight = new FontWeight("700");
        public static w800: FontWeight = new FontWeight("800");
        public static w900: FontWeight = new FontWeight("900");
        private value: string;

        public toString() {
            return this.value;
        }

        public constructor(val: string) {
            this.value = val;
        }
    }
}
