import * as Promise from "bluebird";
import {ServerDataError} from "../server-data-error";
import {RenderingCache} from "./cache";

export class CacheMissingError extends ServerDataError {
    public ids: number[];

    public constructor(ids: number[]) {
        super(`Missing: [${ids.join(", ")}]`);
        this.ids = ids;
    }

    public loadData(cache: RenderingCache): Promise<boolean> {
        return cache.loadEntities(this.ids)
            .then(() => true);
    }
}
