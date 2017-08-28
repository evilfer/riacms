import {ClientDataError} from "../app/client-data-error";
import {ClientCacheMissing} from "./client-cache";

export class ClientCacheDataError extends ClientDataError {
    private missing: ClientCacheMissing;

    public constructor(missing: ClientCacheMissing) {
        super("Cache missing data error");
        this.missing = missing;
    }
}
