namespace Game {
    import Label = Framework.Graphics.Label;
    import RenderContext = Framework.Graphics.RenderContext;

    export class Clock extends Label {
        private time: number;

        public paint(g: RenderContext) {
            this.setText("Hello, world! (" + ++this.time + " seconds elapsed)");
            super.paint(g);
        }

        public constructor() {
            super();
            this.time = 0;
            this.setRepaintPeriod(1000);
            this.addEventListener("click", () => this.time += 1000);
        }
    }
}
