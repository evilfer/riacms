import {ClientDataError} from "../../app/client-data-error";

export class ClientSiteTreeError extends ClientDataError {
    private queries: string[];

    public constructor(queries: string[]) {
        super();
        this.queries = queries;
    }
}
