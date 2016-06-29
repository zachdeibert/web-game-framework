// Constraint.ts
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

/// <reference path="../Function.ts" />
/// <reference path="Component.ts" />
/// <reference path="ConstrainedProperty.ts" />
/// <reference path="ConstrainingError.ts" />
/// <reference path="Rectangle.ts" />

namespace Framework.Graphics {
    import Function = Framework.Function;

    export class Constraint {
        private c1: Component;
        private p1: ConstrainedProperty;
        private c2: Component;
        private p2: ConstrainedProperty;
        private offset: Function<number>;

        public static getProperty(c: Component, p: ConstrainedProperty): number {
            let b: Rectangle = c.getBounds();
            switch ( p ) {
                case ConstrainedProperty.left:
                    return b.minX();
                case ConstrainedProperty.top:
                    return b.minY();
                case ConstrainedProperty.right:
                    return b.maxX();
                case ConstrainedProperty.bottom:
                    return b.maxY();
                case ConstrainedProperty.width:
                    return b.size.width;
                case ConstrainedProperty.height:
                    return b.size.height;
            }
        }

        public static setProperty(c: Component, p: ConstrainedProperty, v: number): boolean {
            let b: Rectangle = c.getBounds();
            let old: Rectangle = b.clone();
            switch ( p ) {
                case ConstrainedProperty.left:
                    b.location.x = v;
                    break;
                case ConstrainedProperty.top:
                    b.location.y = v;
                    break;
                case ConstrainedProperty.right:
                    b.size.width = v - b.location.x;
                    break;
                case ConstrainedProperty.bottom:
                    b.size.height = v - b.location.y;
                    break;
                case ConstrainedProperty.width:
                    b.size.width = v;
                    break;
                case ConstrainedProperty.height:
                    b.size.height = v;
                    break;
            }
            c.setBounds(b);
            return old.equals(b);
        }

        public canBeConstrained(c?: Container): boolean {
            let p1 = this.c1.getParent();
            let p2 = this.c2.getParent();
            return p1 == p2 && p1 != null && c ? c == p1 : true;
        }

        public tryConstrain(): boolean {
            return Constraint.setProperty(this.c2, this.p2, this.offset(Constraint.getProperty(this.c1, this.p1)));
        }

        public isRelatedTo(c: Component): boolean {
            return c == this.c1 || c == this.c2;
        }

        public constructor(c1: Component, p1: ConstrainedProperty, c2: Component, p2: ConstrainedProperty, offset: number | Function<number>) {
            this.c1 = c1;
            this.p1 = p1;
            this.c2 = c2;
            this.p2 = p2;
            if ( typeof(offset) == "function" ) {
                this.offset = offset as Function<number>;
            } else {
                this.offset = (n: number) => n + (offset as number);
            }
            if ( !this.canBeConstrained() ) {
                throw new ConstrainingError("Only two components on the same container can be constrained");
            }
        }
    }
}
