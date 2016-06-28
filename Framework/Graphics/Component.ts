// Component.ts
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

/// <reference path="../EventDispatcher.ts" />
/// <reference path="Color.ts" />
/// <reference path="EventCollector.ts" />
/// <reference path="Font.ts" />
/// <reference path="Gradient.ts" />
/// <reference path="LocationComparator.ts" />
/// <reference path="Point.ts" />
/// <reference path="Rectangle.ts" />
/// <reference path="RenderContext.ts" />
/// <reference path="Shadow.ts" />

namespace Framework.Graphics {
    import EventDispatcher = Framework.EventDispatcher;
    // Circular dependency to Container
    var Container = {};

    export class Component extends EventDispatcher {
        private background: Color | Gradient;
        private foreground: Color | Gradient;
        private border: Color | Gradient;
        private borderRadius: number;
        private stroke: Color | Gradient;
        private shadow: Shadow;
        private font: Font;
        private parent: Container;
        private bounds: Rectangle;
        private repaintPeriod: number;
        private repaintHandle: number;
        private focused: boolean;

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

        public getBorderRadius(): number {
            return this.borderRadius;
        }

        public setBorderRadius(radius: number) {
            this.borderRadius = radius;
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

        public isFocused(): boolean {
            return this.focused;
        }

        public setFocused(v: boolean = true) {
            this.focused = v;
            let parent: Container = this.getParent();
            if ( parent != null ) {
                parent.setFocusedChild(v ? this : null);
            }
            this.repaint();
        }

        public paint(g: RenderContext) {
        }

        public update(g: RenderContext) {
            g.setFill(this.getBackground());
            g.setStroke(this.getBorder());
            g.setShadow(this.getShadow());
            g.setFont(this.getFont());
            let r: number = this.getBorderRadius();
            let b: Dimension = this.getBounds().size;
            g.resetPath();
            if ( r > 0 ) {
                g.pathLine(new Point(r, 0), new Point(b.width - r, 0));
                g.pathArc(new Point(b.width - r, r), r, Math.PI * 3 / 2, 0);
                g.pathLine(new Point(b.width, b.height - r));
                g.pathArc(new Point(b.width - r, b.height - r), r, 0, Math.PI / 2);
                g.pathLine(new Point(r, b.height));
                g.pathArc(new Point(r, b.height - r), r, Math.PI / 2, Math.PI);
                g.pathLine(new Point(0, r));
                g.pathArc(new Point(r, r), r, Math.PI, Math.PI * 3 / 2);
            } else {
                g.pathRect(new Rectangle(new Point(0, 0), b));
            }
            g.fillPath();
            g.drawPath();
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

        public initEvent(type: string, comparator: LocationComparator, collector: EventCollector, exclude?: Container) {
            let parent: Container = this.getParent();
            if ( parent != null ) {
                parent.initEvent(type, collector, comparator);
            }
        }

        public constructor() {
            super();
            this.borderRadius = 0;
            this.repaintPeriod = -1;
            this.repaintHandle = -1;
            this.focused = false;
            this.addEventListener("click", () => this.setFocused());
        }
    }
}
