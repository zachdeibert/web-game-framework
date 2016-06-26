namespace Framework.Graphics {
    export class Color {
        public r: number;
        public g: number;
        public b: number;
        public a: number;

        public toString(): string {
            return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
        }

        public constructor(r?: number, g?: number, b?: number, a?: number) {
            this.r = r || 0;
            this.g = g || 0;
            this.b = b || 0;
            this.a = a || 1;
        }
    }
}
