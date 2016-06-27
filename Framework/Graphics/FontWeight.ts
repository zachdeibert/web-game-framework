// FontWeight.ts
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

namespace Framework.Graphics {
    export class FontWeight {
        public static normal: FontWeight = new FontWeight("normal");
        public static bold: FontWeight = new FontWeight("bold");
        public static bolder: FontWeight = new FontWeight("bolder");
        public static light: FontWeight = new FontWeight("lighter");
        public static w100: FontWeight = new FontWeight("100");
        public static w200: FontWeight = new FontWeight("200");
        public static w300: FontWeight = new FontWeight("300");
        public static w400: FontWeight = new FontWeight("400");
        public static w500: FontWeight = new FontWeight("500");
        public static w600: FontWeight = new FontWeight("600");
        public static w700: FontWeight = new FontWeight("700");
        public static w800: FontWeight = new FontWeight("800");
        public static w900: FontWeight = new FontWeight("900");
        private value: string;

        public toString() {
            return this.value;
        }

        public constructor(val: string) {
            this.value = val;
        }
    }
}
