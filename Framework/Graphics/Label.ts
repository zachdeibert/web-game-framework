namespace Framework.Graphics {
    export class Label extends Component {
        private text: string;

        public getText(): string {
            return this.text;
        }

        public setText(text: string) {
            this.text = text;
            this.repaint();
        }

        public paint(g: RenderContext) {
            g.fillText(this.getText(), new Point(0, this.getFont().lineHeight));
        }

        public constructor(text?: string) {
            super();
            this.text = text;
        }
    }
}
