namespace Framework.Internal {
    import Color = Framework.Graphics.Color;
    import Container = Framework.Graphics.Container;
    import Dimension = Framework.Graphics.Dimension;
    import Font = Framework.Graphics.Font;
    import Frame = Framework.Graphics.Frame;
    import FontFamily = Framework.Graphics.FontFamily;
    import LocationComparator = Framework.Graphics.LocationComparator;
    import Point = Framework.Graphics.Point;
    import Rectangle = Framework.Graphics.Rectangle;
    import RenderContext = Framework.Graphics.RenderContext;
    import Shadow = Framework.Graphics.Shadow;

    export class Canvas extends Frame {
        public canvas: HTMLCanvasElement;
        public g: RenderContext;
        public repainting: boolean;

        public update(g: RenderContext) {
            super.update(g);
            this.repainting = false;
        }

        public repaint() {
            if ( !this.repainting ) {
                this.repainting = true;
                setTimeout(() => this.update(this.g), 0);
            }
        }

        public setBounds(rect: Rectangle) {
            this.canvas.width = rect.size.width;
            this.canvas.height = rect.size.height;
            if ( !rect.isDegenerate() ) {
                this.g = this.g.drawIn(rect, true);
            }
            super.setBounds(rect);
        }

        public resetBounds() {
            this.setBounds(new Rectangle(new Point(0, 0), new Dimension(this.canvas.clientWidth, this.canvas.clientHeight)));
        }

        public initEvent(type: string, comparator: LocationComparator, exclude?: Container) {
            super.initEvent(type, comparator, exclude);
            this.canvas.addEventListener(type, (e: Event) => this.dispatchEvent(e));
        }

        public constructor() {
            super();
            this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
            this.g = new RenderContext(this.canvas.getContext("2d"));
            this.repainting = false;
            this.setBackground(new Color(255, 255, 255));
            this.setForeground(new Color(0, 0, 0));
            this.setBorder(new Color(0, 0, 0));
            this.setStroke(new Color(255, 0, 0));
            this.setShadow(new Shadow(new Color(0, 0, 0), 0));
            this.setFont(new Font(FontFamily.caption));
            this.canvas.addEventListener("touchstart", e => e.preventDefault());
            this.canvas.addEventListener("touchend", e => e.preventDefault());
            this.canvas.addEventListener("touchcancel", e => e.preventDefault());
            this.canvas.addEventListener("touchmove", e => e.preventDefault());
        }
    }
}
