// Label.ts
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
/// <reference path="Point.ts" />
/// <reference path="RenderContext.ts" />
/// <reference path="TextAlign.ts" />

namespace Framework.Graphics {
    export class Label extends Component {
        private text: string;
        private align: TextAlign;

        public getText(): string {
            return this.text;
        }

        public setText(text: string) {
            this.text = text;
            this.repaint();
        }

        public getTextAlign(): TextAlign {
            return this.align;
        }

        public setTextAlign(align: TextAlign) {
            this.align = align;
            this.repaint();
        }

        public paint(g: RenderContext) {
            let text: string = this.getText();
            switch ( this.getTextAlign() ) {
                case TextAlign.start:
                case TextAlign.left:
                    g.fillText(text, new Point(0, this.getFont().lineHeight));
                    break;
                case TextAlign.center:
                    g.fillText(text, new Point((this.getBounds().size.width - g.measure(text).width) / 2, this.getFont().lineHeight));
                    break;
                case TextAlign.end:
                case TextAlign.right:
                    g.fillText(text, new Point(this.getBounds().size.width - g.measure(text).width, this.getFont().lineHeight));
                    break;
            }
        }

        public constructor(text?: string) {
            super();
            this.text = text;
            this.align = TextAlign.left;
        }
    }
}
