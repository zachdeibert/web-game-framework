namespace Framework.Graphics {
    import EventDispatcher = Framework.EventDispatcher;

    export class Component extends EventDispatcher {
        private background: Color | Gradient;
        private foreground: Color | Gradient;
        private border: Color | Gradient;
        private stroke: Color | Gradient;
        private shadow: Shadow;
        private font: Font;
        private parent: Container;
        private bounds: Rectangle;
        private repaintPeriod: number;
        private repaintHandle: number;

        public getBackground(): Color | Gradient {
            return this.background || this.getParent().getBackground();
        }

        public setBackground(background: Color | Gradient) {
            this.background = background;
            this.repaint();
        }

        public getForeground(): Color | Gradient {
            return this.foreground || this.getParent().getForeground();
        }

        public setForeground(foreground: Color | Gradient) {
            this.foreground = foreground;
            this.repaint();
        }

        public getBorder(): Color | Gradient {
            return this.border || this.getParent().getBorder();
        }

        public setBorder(border: Color | Gradient) {
            this.border = border;
            this.repaint();
        }

        public getStroke(): Color | Gradient {
            return this.stroke || this.getParent().getStroke();
        }

        public setStroke(stroke: Color | Gradient) {
            this.stroke = stroke;
            this.repaint();
        }

        public getShadow(): Shadow {
            return this.shadow || this.getParent().getShadow();
        }

        public setShadow(shadow: Shadow) {
            this.shadow = shadow;
            this.repaint();
        }

        public getFont(): Font {
            return this.font || this.getParent().getFont();
        }

        public setFont(font: Font) {
            this.font = font;
            this.repaint();
        }

        public getParent(): Container {
            return this.parent;
        }

        public setParent(parent: Container) {
            this.parent = parent;
            this.repaint();
        }

        public getBounds(): Rectangle {
            return this.bounds;
        }

        public setBounds(bounds: Rectangle) {
            this.bounds = bounds;
            this.repaint();
        }

        public getRepaintPeriod(): number {
            return this.repaintPeriod;
        }

        public setRepaintPeriod(period: number) {
            if ( this.repaintHandle >= 0 ) {
                clearTimeout(this.repaintHandle);
                this.repaintHandle = -1;
            }
            if ( period >= 0 ) {
                this.repaintPeriod = period;
                this.repaintHandle = setInterval(() => this.repaint(), period);
            } else {
                this.repaintPeriod = -1;
            }
        }

        public paint(g: RenderContext) {
        }

        public update(g: RenderContext) {
            g.setFill(this.getBackground());
            g.setStroke(this.getBorder());
            g.setShadow(this.getShadow());
            g.setFont(this.getFont());
            g.clear();
            g.setFill(this.getForeground());
            g.setStroke(this.getBorder());
            this.paint(g);
        }

        public repaint() {
            let parent: Container = this.getParent();
            if ( parent != null ) {
                parent.repaintChild(this);
            }
        }

        public initEvent(type: string, comparator: LocationComparator, exclude?: Container) {
            let parent: Container = this.getParent();
            if ( parent != null ) {
                parent.initEvent(type, comparator);
            }
        }

        public constructor() {
            super();
            this.repaintPeriod = -1;
            this.repaintHandle = -1;
        }
    }
}
