/// <reference path="Rectangle.ts" />

namespace Framework.Graphics {
    export interface IMedia {
        draw(ctx: CanvasRenderingContext2D, clip: Rectangle, rect: Rectangle): void;
    }
}
