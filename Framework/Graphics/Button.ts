// Button.ts
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
/// <reference path="DOMEvents.ts" />
/// <reference path="Gradient.ts" />
/// <reference path="Label.ts" />

namespace Framework.Graphics {
    export class Button extends Label {
        private hoverColor: Color | Gradient;
        private hover: boolean;

        public getHoverBackground(): Color | Gradient {
            return this.hoverColor;
        }

        public setHoverBackground(hoverColor: Color | Gradient) {
            this.hoverColor = hoverColor;
            this.repaint();
        }

        public getBackground(): Color | Gradient {
            return this.hover ? this.getHoverBackground() : super.getBackground();
        }

        public constructor(text?: string) {
            super(text);
            this.setBackground(new Color(191, 191, 191));
            this.setHoverBackground(new Color(127, 127, 127));
            this.setBorder(new Color(63, 63, 63));
            this.setBorderRadius(4);
            this.setTextAlign(TextAlign.center);
            this.hover = false;
            let ev: DOMEvents = new DOMEvents(this);
            ev.click();
            ev.mouseOver();
            ev.mouseOut();
            this.addEventListener("mouseover", () => {
                this.hover = true;
                this.repaint();
            });
            this.addEventListener("mouseout", () => {
                this.hover = false;
                this.repaint();
            });
        }
    }
}
