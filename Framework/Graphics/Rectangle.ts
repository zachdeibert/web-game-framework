// Rectangle.ts
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

/// <reference path="Dimension.ts" />
/// <reference path="Point.ts" />

namespace Framework.Graphics {
    export class Rectangle {
        public location: Point;
        public size: Dimension;

        public minX(): number {
            return this.location.x;
        }

        public centerX(): number {
            return this.location.x + this.size.width / 2;
        }

        public maxX(): number {
            return this.location.x + this.size.width;
        }

        public width(): number {
            return this.size.width;
        }

        public minY(): number {
            return this.location.y;
        }

        public centerY(): number {
            return this.location.y + this.size.height / 2;
        }

        public maxY(): number {
            return this.location.y + this.size.height;
        }

        public height(): number {
            return this.size.height;
        }

        public center(): Point {
            return new Point(this.centerX(), this.centerY());
        }

        public isDegenerate(): boolean {
            return this.size.width <= 0 || this.size.height <= 0;
        }

        public intersect(other: Rectangle): Rectangle {
            let r: Rectangle = new Rectangle(new Point(Math.max(this.minX(), other.minX()),
                                                       Math.max(this.minY(), other.minY())),
                                             new Point(Math.min(this.maxX(), other.maxX()),
                                                       Math.min(this.maxY(), other.maxY())));
            if ( r.isDegenerate() ) {
                return null;
            } else {
                return r;
            }
        }

        public contains(p: Point): boolean {
            return p.x >= this.minX() && p.x <= this.maxX() && p.y >= this.minY() && p.y <= this.maxY();
        }

        public constructor(location?: Point, size?: Dimension | Point) {
            this.location = location || new Point();
            if ( size instanceof Dimension ) {
                this.size = size;
            } else if ( size instanceof Point ) {
                this.size = new Dimension(size.x - location.x, size.y - location.y);
            } else {
                this.size = new Dimension();
            }
        }
    }
}
