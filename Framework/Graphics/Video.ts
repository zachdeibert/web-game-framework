/// <reference path="IMedia.ts" />
/// <reference path="Rectangle.ts" />

namespace Framework.Graphics {
    export class Video implements IMedia {
        private video: HTMLVideoElement;

        public draw(ctx: CanvasRenderingContext2D, clip: Rectangle, rect: Rectangle) {
            ctx.drawImage(this.video, clip.location.x, clip.location.y, clip.size.width, clip.size.height, rect.location.x, rect.location.y, rect.size.width, rect.size.height);
        }

        public constructor(...urls: string[]) {
            this.video = document.createElement("video");
            for ( var i = 0; i < urls.length; ++i ) {
                let source: HTMLSourceElement = document.createElement("source");
                source.setAttribute("src", urls[i]);
                this.video.appendChild(source);
            }
            document.getElementById("assets").appendChild(this.video);
        }
    }
}
