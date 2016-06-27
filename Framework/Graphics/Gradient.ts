// Gradient.ts
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

/// <reference path="Color.ts" />

namespace Framework.Graphics {
    export class Gradient {
        private obj: CanvasGradient;

        public toCanvasGradient(): CanvasGradient {
            return this.obj;
        }

        public constructor(ctx: CanvasRenderingContext2D, x0: number, y0: number, r0: number = 0, x1: number, y1: number, r1: number = 0, stops: { [location: number]: Color }) {
            this.obj = r0 == 0 && r1 == 0 ? ctx.createLinearGradient(x0, y0, x1, y1) : ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
            for ( var stop in stops ) {
                this.obj.addColorStop(parseFloat(stop), stops[stop].toString());
            }
        }
    }
}
