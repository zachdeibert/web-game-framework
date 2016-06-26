namespace Framework.Graphics {
    export class OffscreenBuffer implements IMedia {
        private canvas: HTMLCanvasElement;
        private ctx: CanvasRenderingContext2D;

        public getContext(): RenderContext {
            return new RenderContext(this.ctx);
        }

        public draw(ctx: CanvasRenderingContext2D, clip: Rectangle, rect: Rectangle) {
            ctx.drawImage(this.canvas, clip.location.x, clip.location.y, clip.size.width, clip.size.height, rect.location.x, rect.location.y, rect.size.width, rect.size.height);
        }

        public constructor(width: number, height: number) {
            this.canvas = document.createElement("canvas");
            this.canvas.setAttribute("width", width.toString());
            this.canvas.setAttribute("height", height.toString());
            document.getElementById("assets").appendChild(this.canvas);
            this.ctx = this.canvas.getContext("2d");
        }
    }
}
