import * as Promise from "bluebird";
import {ServerDataError} from "../../server-data-error";
import {RenderingCache} from "../../orm/cache";
import {CacheQueryBuilder} from "../../orm/cache-query-builder";

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
        return Object.keys(this.query).reduce((acc: CacheQueryBuilder, field) => {
            return acc.valueEquals(field, this.query[field]);
        }, cache.find()).run().then(cacheEntities => {
            this.queryCache[this.queryStr] = cacheEntities.map(ce => ce.proxy);
            return null;
        });
    }
}
