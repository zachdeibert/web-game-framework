namespace Framework.Internal {
    export class LoadError extends Error {
        public constructor(message?: string) {
            super(message);
        }
    }
}
