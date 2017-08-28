import {ClientDataError} from "../../app/client-data-error";

export class ClientEntityFinderError extends ClientDataError {
    private queries: Array<{ [field: string]: number | boolean | string }>;

    public constructor(queries: Array<{ [field: string]: number | boolean | string }>) {
        super();
        this.queries = queries;
    }
}
