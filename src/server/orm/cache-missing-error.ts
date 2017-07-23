export class CacheMissingError extends Error {
    public ids: number[];

    public constructor(ids: number[]) {
        super(`Missing: [${ids.join(", ")}]`);
        this.ids = ids;
    }
}
