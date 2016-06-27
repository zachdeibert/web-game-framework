// Font.ts
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

/// <reference path="FontFamily.ts" />
/// <reference path="FontStyle.ts" />
/// <reference path="FontVariant.ts" />
/// <reference path="FontWeight.ts" />
/// <reference path="TextAlign.ts" />
/// <reference path="TextBaseline.ts" />

namespace Framework.Graphics {
    export class Font {
        public style: FontStyle;
        public variant: FontVariant;
        public weight: FontWeight;
        public size: number;
        public lineHeight: number;
        public family: FontFamily | string;
        public align: TextAlign;
        public baseline: TextBaseline;

        public toString(): string {
            return "" + (this.style ? this.style.toString() + " " : "") +
                        (this.variant ? this.variant.toString() + " " : "") +
                        (this.weight ? this.weight.toString() + " " : "") +
                        this.size + "px/" + this.lineHeight + "px " +
                        this.family;
        }

        public constructor(family: FontFamily | string, size: number = 14, lineHeight: number = size, weight?: FontWeight, variant?: FontVariant, style?: FontStyle, align?: TextAlign, baseline?: TextBaseline) {
            this.style = style;
            this.variant = variant;
            this.weight = weight;
            this.size = size;
            this.lineHeight = lineHeight;
            this.family = family;
            this.align = align || TextAlign.left;
            this.baseline = baseline || TextBaseline.alphabetic;
        }
    }
}
