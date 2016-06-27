// Main.ts
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

/// <reference path="Clock.ts" />

namespace Game {
    import Color = Framework.Graphics.Color;
    import Component = Framework.Graphics.Component;
    import Dimension = Framework.Graphics.Dimension;
    import Frame = Framework.Graphics.Frame;
    import Label = Framework.Graphics.Label;
    import Point = Framework.Graphics.Point;
    import Rectangle = Framework.Graphics.Rectangle;
    import View = Framework.Graphics.View;

    export class Main {
        public static main(frame: Frame) {
            let view: View = new View("exampleView");
            let lbl: Label = new Clock();
            lbl.setBounds(new Rectangle(new Point(0, 0), new Dimension(320, 480)));
            view.setBounds(new Rectangle(new Point(0, 0), new Dimension(640, 480)));
            lbl.setBackground(new Color(255, 0, 0, 0.75));
            view.setBackground(new Color(0, 255, 0));
            view.addEventListener("click", () => view.setBackground(new Color(0, 0, 255)));
            view.add(lbl);
            frame.add(view);
            frame.openView("exampleView");
            frame.initEvent("click", (e: Event, c: Component) => {
                let m: MouseEvent = e as MouseEvent;
                let b: Rectangle = c.getBounds();
                return m.clientX >= b.minX() && m.clientX <= b.maxX() && m.clientY >= b.minY() && m.clientY <= b.maxY();
            });
        }
    }
}
