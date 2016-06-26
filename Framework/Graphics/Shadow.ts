namespace Framework.Graphics {
    export class Shadow {
        public color: Color;
        public blur: number;
        public offset: Point;

        public Shadow(color: Color, blur: number = 10, offset?: Point) {
            this.color = color;
            this.blur = blur;
            this.offset = offset || new Point();
        }
    }
}
