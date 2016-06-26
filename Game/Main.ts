namespace Game {
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
            lbl.setBounds(new Rectangle(new Point(0, 0), new Dimension(640, 480)));
            view.add(lbl);
            frame.add(view);
            frame.openView("exampleView");
        }
    }
}
