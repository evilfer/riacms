import {EntityFinderStore} from "../../../common/bundles/entity-finder/entity-finder-data";
import {EntityFinderError} from "./entity-finder-error";

export class EntityFinder implements EntityFinderStore {
    private queryCache: { [queryStr: string]: any[] } = {};
    private nameCache: { [queryStr: string]: string } = {};

    public find(name: string, query: { [field: string]: number | boolean | string }) {
        const queryStr = JSON.stringify(query);
        if (this.queryCache[queryStr]) {
            return {
                data: this.queryCache[queryStr],
                loading: false,
            };
        } else {
            throw new EntityFinderError(name, queryStr, query, this.queryCache);
        }
    }
}
