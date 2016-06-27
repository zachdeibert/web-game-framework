// OffscreenBuffer.ts
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

/// <reference path="IMedia.ts" />
/// <reference path="Rectangle.ts" />
/// <reference path="RenderContext.ts" />

namespace Framework.Graphics {
    export class OffscreenBuffer implements IMedia {
        private canvas: HTMLCanvasElement;
        private ctx: CanvasRenderingContext2D;

        public getContext(): RenderContext {
            return new RenderContext(this.ctx);
        }

        public draw(ctx: CanvasRenderingContext2D, clip: Rectangle, rect: Rectangle) {
            ctx.drawImage(this.canvas, clip.location.x, clip.location.y, clip.size.width, clip.size.height, rect.location.x, rect.location.y, rect.size.width, rect.size.height);
        }

        public constructor(width: number, height: number) {
            this.canvas = document.createElement("canvas");
            this.canvas.setAttribute("width", width.toString());
            this.canvas.setAttribute("height", height.toString());
            document.getElementById("assets").appendChild(this.canvas);
            this.ctx = this.canvas.getContext("2d");
        }
    }
}
