import * as Promise from "bluebird";
import {RenderingCache} from "../../orm/cache";
import {ServerDataError} from "../../server-data-error";

export class EntityFinderError extends ServerDataError {
    private query: { [field: string]: string | boolean | number };
    private queryStr: string;
    private queryCache: { [queryStr: string]: any[] };

    constructor(name: string,
                queryStr: string,
                query: { [field: string]: string | boolean | number },
                queryCache: { [queryStr: string]: any[] }) {

        super(`Missing finder error: [${name}] [${queryStr}]`);
        this.query = query;
        this.queryStr = queryStr;
        this.queryCache = queryCache;
    }

    public loadData(cache: RenderingCache): Promise<null | Error> {
        const entityType: string = this.query._type as string;

        if (!entityType) {
            return Promise.reject(new Error("no entity type"));
        }

        Object.keys(this.query);
        const query = cache.find().implementsType(entityType);

        return Object.keys(this.query)
            .filter(key => key !== "_type")
            .reduce((acc, key) => acc.valueEquals(entityType, key, this.query[key]), query)
            .run().then(cacheEntities => {
                this.queryCache[this.queryStr] = cacheEntities.map(ce => ce.proxy);
                return null;
            });
    }
}
