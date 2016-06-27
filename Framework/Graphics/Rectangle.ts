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
