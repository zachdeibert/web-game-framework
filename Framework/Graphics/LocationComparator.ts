namespace Framework.Graphics {
    export interface LocationComparator {
        (e: Event, c: Component): boolean;
    }
}