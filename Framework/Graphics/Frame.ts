/// <reference path="Component.ts" />
/// <reference path="Container.ts" />
/// <reference path="GraphicsError.ts" />
/// <reference path="Rectangle.ts" />
/// <reference path="RenderContext.ts" />
/// <reference path="View.ts" />

namespace Framework.Graphics {
    export class Frame extends Container {
        private activeId: string | number;
        private activeView: View;
        private views: View[];

        public getActiveId(): string | number {
            return this.activeId;
        }

        public getActiveView(): View {
            return this.activeView;
        }

        public openView(id: string | number) {
            for ( var i: number = 0; i < this.views.length; ++i ) {
                if ( this.views[i].getId() == id ) {
                    this.activeId = id;
                    this.activeView = this.views[i];
                    this.repaint();
                    return;
                }
            }
            throw new GraphicsError("View not found");
        }

        public add(view: View) {
            if ( this.views.indexOf(view) < 0 ) {
                this.views.push(view);
                view.setParent(this);
            }
        }

        public update(g: RenderContext) {
            if ( this.activeView != null ) {
                this.activeView.update(g);
            }
        }

        public setBounds(rect: Rectangle) {
            for ( var i: number = 0; i < this.views.length; ++i ) {
                this.views[i].setBounds(rect);
            }
        }

        public repaintChild(child: Component) {
            if ( child == this.activeView ) {
                this.repaint();
            }
        }

        public remove(child: Component) {
            throw new GraphicsError("Method remove() cannot be called on Frame");
        }

        public getChildren(): Component[] {
            return this.views;
        }

        public constructor() {
            super();
            this.views = [];
        }
    }
}
