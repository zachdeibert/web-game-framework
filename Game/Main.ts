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
