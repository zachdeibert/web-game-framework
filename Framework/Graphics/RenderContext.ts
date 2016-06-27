// RenderContext.ts
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

/// <reference path="CapStyle.ts" />
/// <reference path="Color.ts" />
/// <reference path="Font.ts" />
/// <reference path="Gradient.ts" />
/// <reference path="IMedia.ts" />
/// <reference path="JoinStyle.ts" />
/// <reference path="Point.ts" />
/// <reference path="Rectangle.ts" />
/// <reference path="Shadow.ts" />

namespace Framework.Graphics {
    export class RenderContext {
        private ctx: CanvasRenderingContext2D;
        private clip: Rectangle;
        private fill: Color | Gradient;
        private stroke: Color | Gradient;
        private shadow: Shadow;
        private font: Font;

        protected getRealPoint(p: Point): Point {
            let t = new Point(p.x + this.clip.location.x, p.y + this.clip.location.y);
            if ( t.x <= this.clip.maxX() && t.x >= this.clip.minX() && t.y <= this.clip.maxY() && t.y >= this.clip.maxX() ) {
                return t;
            } else {
                return null;
            }
        }

        protected getRealRectangle(rect: Rectangle): Rectangle {
            let limits: Rectangle = new Rectangle(new Point(0, 0), this.clip.size);
            let limited = rect.intersect(limits);
            if ( limited == null ) {
                return null;
            } else {
                limited.location.x += this.clip.location.x;
                limited.location.y += this.clip.location.y;
                return limited;
            }
        }

        public clear(rect?: Rectangle) {
            let real: Rectangle = rect == null ? this.clip : this.getRealRectangle(rect);
            if ( real != null ) {
                this.ctx.fillRect(real.minX(), real.minY(), real.width(), real.height());
            }
        }

        public getFill(): Color | Gradient {
            return this.fill;
        }

        public setFill(fill: Color | Gradient) {
            this.fill = fill;
            if ( fill instanceof Color ) {
                this.ctx.fillStyle = fill.toString();
            } else {
                this.ctx.fillStyle = fill.toCanvasGradient();
            }
        }

        public getStroke(): Color | Gradient {
            return this.stroke;
        }

        public setStroke(stroke: Color | Gradient) {
            this.stroke = stroke;
            if ( stroke instanceof Color ) {
                this.ctx.strokeStyle = stroke.toString();
            } else {
                this.ctx.strokeStyle = stroke.toCanvasGradient();
            }
        }

        public getShadow(): Shadow {
            return this.shadow;
        }

        public setShadow(shadow: Shadow) {
            this.shadow = shadow;
            this.ctx.shadowColor = shadow.color.toString();
            this.ctx.shadowBlur = shadow.blur;
            this.ctx.shadowOffsetX = shadow.offset.x;
            this.ctx.shadowOffsetY = shadow.offset.y;
        }

        public getCap(): CapStyle {
            let styles: any = CapStyle;
            let style: any = styles[this.ctx.lineCap];
            return style as CapStyle;
        }

        public setCap(cap: CapStyle) {
            this.ctx.lineCap = cap.toString();
        }

        public getJoin(): JoinStyle {
            let styles: any = JoinStyle;
            let style: any = styles[this.ctx.lineJoin];
            return style as JoinStyle;
        }

        public setJoin(cap: CapStyle, limit: number = this.ctx.miterLimit) {
            this.ctx.lineJoin = cap.toString();
            this.ctx.miterLimit = limit;
        }

        public getFont(): Font {
            return this.font;
        }

        public setFont(font: Font) {
            this.font = font;
            this.ctx.font = font.toString();
            this.ctx.textAlign = font.align.toString();
            this.ctx.textBaseline = font.baseline.toString();
        }

        public createGradient(x0: number, y0: number, r0: number = 0, x1: number, y1: number, r1: number = 0, stops: { [location: number]: Color }): Gradient {
            return new Gradient(this.ctx, x0, y0, r0, x1, y1, r1, stops);
        }

        public drawIn(rect: Rectangle, ignoreClip?: boolean): RenderContext {
            let real: Rectangle = ignoreClip ? rect : this.getRealRectangle(rect);
            if ( real == null ) {
                return null;
            } else {
                return new RenderContext(this.ctx, real);
            }
        }

        public drawRect(rect: Rectangle) {
            let real: Rectangle = this.getRealRectangle(rect);
            if ( real != null ) {
                this.ctx.strokeRect(real.minX(), real.minY(), real.width(), real.height());
            }
        }

        public fillRect(rect: Rectangle) {
            let real: Rectangle = this.getRealRectangle(rect);
            if ( real != null ) {
                this.ctx.fillRect(real.minX(), real.minY(), real.width(), real.height());
            }
        }

        public pathRect(rect: Rectangle) {
            let real: Rectangle = this.getRealRectangle(rect);
            if ( real != null ) {
                this.ctx.rect(real.minX(), real.minY(), real.width(), real.height());
            }
        }

        public pathLine(p1: Point, p2?: Point) {
            if ( p2 ) {
                this.setPathPos(p1);
                this.pathLine(p2);
            } else {
                let real: Point = this.getRealPoint(p1);
                if ( real != null ) {
                    this.ctx.lineTo(real.x, real.y);
                }
            }
        }

        public pathQuadratic(control: Point, p1: Point, p2?: Point) {
            if ( p2 ) {
                this.setPathPos(p1);
                this.pathQuadratic(control, p2);
            } else {
                let rc: Point = this.getRealPoint(control);
                let rp: Point = this.getRealPoint(p1);
                if ( rc != null && rp != null ) {
                    this.ctx.quadraticCurveTo(rc.x, rc.y, rp.x, rp.y);
                }
            }
        }

        public pathBezier(control1: Point, control2: Point, p1: Point, p2?: Point) {
            if ( p2 ) {
                this.setPathPos(p1);
                this.pathBezier(control1, control2, p2);
            } else {
                let rc1: Point = this.getRealPoint(control1);
                let rc2: Point = this.getRealPoint(control2);
                let rp: Point = this.getRealPoint(p1);
                if ( rc1 != null && rc2 != null && rp != null ) {
                    this.ctx.bezierCurveTo(rc1.x, rc1.y, rc2.x, rc2.y, rp.x, rp.y);
                }
            }
        }

        public drawArc(center: Point, radius: number, start: number = 0, end: number = Math.PI * 2, ccw?: boolean) {
            this.pathArc(center, radius, start, end, ccw);
            this.drawPath();
        }

        public fillArc(center: Point, radius: number) {
            this.pathArc(center, radius);
            this.fillPath();
        }

        public pathArc(center: Point, radius: number, start: number = 0, end: number = Math.PI * 2, ccw?: boolean) {
            let real: Point = this.getRealPoint(center);
            if ( real != null ) {
                this.ctx.arc(real.x, real.y, radius, start, end, ccw);
            }
        }

        public drawTangentArc(t1: Point, t2: Point, radius: number) {
            this.pathTangentArc(t1, t2, radius);
            this.drawPath();
        }

        public pathTangentArc(t1: Point, t2: Point, radius: number) {
            let r1: Point = this.getRealPoint(t1);
            let r2: Point = this.getRealPoint(t2);
            if ( r1 != null && r2 != null ) {
                this.ctx.arcTo(t1.x, t1.y, t2.x, t2.y, radius);
            }
        }

        public drawText(text: string, p: Point, maxWidth: number = this.clip.size.width) {
            let real: Rectangle = this.getRealRectangle(new Rectangle(p, new Dimension(maxWidth, 1)));
            if ( real != null ) {
                this.ctx.strokeText(text, real.location.x, real.location.y, real.size.width);
            }
        }

        public fillText(text: string, p: Point, maxWidth: number = this.clip.size.width) {
            let real: Rectangle = this.getRealRectangle(new Rectangle(p, new Dimension(maxWidth, 1)));
            if ( real != null ) {
                this.ctx.fillText(text, real.location.x, real.location.y, real.size.width);
            }
        }

        public measure(text: string): TextMetrics {
            return this.ctx.measureText(text);
        }

        public drawPath() {
            this.ctx.stroke();
        }

        public fillPath() {
            this.ctx.fill();
        }

        public drawMedia(media: IMedia, rect: Rectangle) {
            media.draw(this.ctx, this.clip, rect);
        }

        public resetPath() {
            this.ctx.beginPath();
        }

        public finishPath() {
            this.ctx.closePath();
        }

        public setPathPos(p: Point) {
            let real: Point = this.getRealPoint(p);
            if ( real != null ) {
                this.ctx.moveTo(real.x, real.y);
            }
        }

        public constructor(ctx: CanvasRenderingContext2D, clip?: Rectangle) {
            this.ctx = ctx;
            this.clip = clip || new Rectangle(new Point(0, 0), new Dimension(ctx.canvas.width, ctx.canvas.height));
        }
    }
}
