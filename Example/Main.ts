namespace Example {
    export class Main {
        public static main(frame: Framework.Graphics.Frame) {
            let Dimension = Framework.Graphics.Dimension;
            let Label = Framework.Graphics.Label;
            let Point = Framework.Graphics.Point;
            let Rectangle = Framework.Graphics.Rectangle;
            let View = Framework.Graphics.View;

            let view = new View("exampleView");
            let lbl = new Label("Hello, world!");
            lbl.setBounds(new Rectangle(new Point(0, 0), new Dimension(640, 480)));
            view.add(lbl);
            frame.add(view);
            frame.openView("exampleView");
        }
    }
}
