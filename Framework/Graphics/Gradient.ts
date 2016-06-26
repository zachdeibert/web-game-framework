namespace Framework.Graphics {
    export class Gradient {
        private obj: CanvasGradient;

        public toCanvasGradient(): CanvasGradient {
            return this.obj;
        }

        public constructor(ctx: CanvasRenderingContext2D, x0: number, y0: number, r0: number = 0, x1: number, y1: number, r1: number = 0, stops: { [location: number]: Color }) {
            this.obj = r0 == 0 && r1 == 0 ? ctx.createLinearGradient(x0, y0, x1, y1) : ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
            for ( var stop in stops ) {
                this.obj.addColorStop(parseFloat(stop), stops[stop].toString());
            }
        }
    }
}
