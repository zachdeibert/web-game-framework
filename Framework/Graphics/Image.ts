/// <reference path="IMedia.ts" />
/// <reference path="Rectangle.ts" />

namespace Framework.Graphics {
    export class Image implements IMedia {
        private image: HTMLImageElement;

        public draw(ctx: CanvasRenderingContext2D, clip: Rectangle, rect: Rectangle) {
            ctx.drawImage(this.image, clip.location.x, clip.location.y, clip.size.width, clip.size.height, rect.location.x, rect.location.y, rect.size.width, rect.size.height);
        }

        public constructor(url: string) {
            this.image = document.createElement("img");
            this.image.setAttribute("src", url);
            document.getElementById("assets").appendChild(this.image);
        }
    }
}
