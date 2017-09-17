import * as Promise from "bluebird";
import {ServerDataError} from "../app/server-data-error";
import {RenderingCache} from "./server-cache";

export class CacheMissingComputedField extends ServerDataError {
    public promise: Promise<void>;

    public constructor(type: string, field: string, promise: Promise<void>) {
        super(`Missing computed: ${type}->${field}`);
        this.promise = promise;
    }

    public loadData(cache: RenderingCache): Promise<null | Error> {
        return this.promise.then(() => null);
    }
}
