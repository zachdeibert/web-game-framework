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
