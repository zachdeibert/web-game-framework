namespace Framework.Graphics {
    export class Point {
        public x: number;
        public y: number;

        public constructor(x?: number, y?: number) {
            this.x = x || 0;
            this.y = y || 0;
        }
    }
}
