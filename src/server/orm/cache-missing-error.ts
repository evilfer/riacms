import * as Promise from "bluebird";
import {ServerDataError} from "../app/server-data-error";
import {RenderingCache} from "./server-cache";

export class CacheMissingError extends ServerDataError {
    public ids: number[];

    public constructor(ids: number[]) {
        super(`Missing: [${ids.join(", ")}]`);
        this.ids = ids;
    }

    public loadData(cache: RenderingCache): Promise<null | Error> {
        return cache.loadEntities(this.ids)
            .then(() => null);
    }
}
