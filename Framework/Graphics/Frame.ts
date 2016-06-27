// Frame.ts
//
// Copyright (c) 2016 Zach Deibert
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

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
