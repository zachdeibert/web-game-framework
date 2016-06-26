namespace Framework.Graphics {
    export class FontVariant {
        public static normal: FontVariant = new FontVariant("normal");
        public static smallCaps: FontVariant = new FontVariant("small-caps");
        private value: string;

        public toString() {
            return this.value;
        }

        public constructor(val: string) {
            this.value = val;
        }
    }
}
