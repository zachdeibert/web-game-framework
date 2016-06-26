namespace Framework.Graphics {
    export class Dimension {
        public width: number;
        public height: number;

        public constructor(width?: number, height?: number) {
            this.width = width || 0;
            this.height = height || 0;
        }
    }
}
