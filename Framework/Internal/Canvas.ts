// Canvas.ts
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

/// <reference path="../Graphics/Color.ts" />
/// <reference path="../Graphics/Dimension.ts" />
/// <reference path="../Graphics/Font.ts" />
/// <reference path="../Graphics/Frame.ts" />
/// <reference path="../Graphics/FontFamily.ts" />
/// <reference path="../Graphics/LocationComparator.ts" />
/// <reference path="../Graphics/Point.ts" />
/// <reference path="../Graphics/Rectangle.ts" />
/// <reference path="../Graphics/RenderContext.ts" />
/// <reference path="../Graphics/Shadow.ts" />

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
