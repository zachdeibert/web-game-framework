namespace Framework.Graphics {
    export class Container extends Component {
        private children: Component[];
        private repaintingChildren: Component[];
        private needsFullRepaint: boolean;

        public paint(g: RenderContext) {
            for ( var i: number = 0; i < this.repaintingChildren.length; ++i ) {
                this.repaintingChildren[i].update(g.drawIn(this.repaintingChildren[i].getBounds()));
            }
            this.repaintingChildren = [];
        }

        public update(g: RenderContext) {
            if ( this.needsFullRepaint ) {
                this.repaintingChildren = this.children;
                super.update(g);
            } else {
                this.paint(g);
            }
        }

        public repaintChild(child: Component) {
            if ( this.repaintingChildren.indexOf(child) < 0 ) {
                this.repaintingChildren.push(child);
                if ( this.repaintingChildren.length == 1 ) {
                    super.repaint();
                }
            }
        }

        public repaint() {
            this.needsFullRepaint = true;
            super.repaint();
        }

        public add(child: Component) {
            if ( this.children.indexOf(child) < 0 ) {
                this.children.push(child);
                child.setParent(this);
                this.repaint();
            }
        }

        public remove(child: Component) {
            if ( this.children.indexOf(child) >= 0 ) {
                this.children = this.children.filter((v: Component) => v == child);
                this.repaint();
            }
        }

        public constructor() {
            super();
            this.children = [];
            this.repaintingChildren = [];
            this.needsFullRepaint = true;
        }
    }
}
