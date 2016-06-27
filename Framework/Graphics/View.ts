/// <reference path="Container.ts" />

namespace Framework.Graphics {
    export class View extends Container {
        private id: string | number;

        public getId(): string | number {
            return this.id;
        }

        public constructor(id: string | number) {
            super();
            this.id = id;
        }
    }
}
