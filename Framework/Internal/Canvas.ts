namespace Framework.Internal {
    import Color = Framework.Graphics.Color;
    import Container = Framework.Graphics.Container;
    import Font = Framework.Graphics.Font;
    import FontFamily = Framework.Graphics.FontFamily;
    import RenderContext = Framework.Graphics.RenderContext;
    import Shadow = Framework.Graphics.Shadow;

    export class Canvas extends Container {
        public g: RenderContext;
        public repainting: boolean;

        public repaint() {
            if ( !this.repainting ) {
                this.repainting = true;
                setTimeout(() => this.update(this.g), 0);
            }
        }

        public constructor() {
            super();
            this.g = new RenderContext((document.getElementById("canvas") as HTMLCanvasElement).getContext("2d"));
            this.repainting = false;
            this.setBackground(new Color(255, 255, 255));
            this.setForeground(new Color(0, 0, 0));
            this.setBorder(new Color(0, 0, 0));
            this.setStroke(new Color(255, 0, 0));
            this.setShadow(new Shadow(new Color(0, 0, 0), 0));
            this.setFont(new Font(FontFamily.caption));
        }
    }
}