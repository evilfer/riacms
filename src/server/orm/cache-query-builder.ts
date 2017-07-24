import {CacheEntity, RenderingCache} from "./cache";
import {EntityDb, EntityQueryBuilder, QueryBuilder} from "./entity-db";

export class CacheQueryBuilder implements QueryBuilder {
    private db: EntityDb;
    private query: EntityQueryBuilder;
    private cache: RenderingCache;

    constructor(cache: RenderingCache, db: EntityDb, level: number) {
        this.cache = cache;
        this.db = db;
        this.query = db.find(level);
    }

    public run(): Promise<CacheEntity[]> {
        return this.query.run().then(entities => this.cache.addEntities(entities));
    }

    public valueEquals(field: string, value: (any | string | boolean | number)): CacheQueryBuilder {
        this.query.valueEquals(field, value);
        return this;
    }

    public valueIn(field: string, values: Array<any | string | boolean | number>): CacheQueryBuilder {
        this.query.valueIn(field, values);
        return this;
    }

    public arrayContains(field: string, value: (any | string | boolean | number)): CacheQueryBuilder {
        this.query.arrayContains(field, value);
        return this;
    }

    public arrayContainsAny(field: string, values: Array<any | string | boolean | number>): CacheQueryBuilder {
        this.query.arrayContainsAny(field, values);
        return this;
    }
}
