import * as Promise from "bluebird";
import {CacheEntity, RenderingCache} from "./cache";
import {EntityQueryBuilder, EntityReadDb, QueryBuilder} from "./entity-db";

export class CacheQueryBuilder implements QueryBuilder<CacheQueryBuilder> {
    private db: EntityReadDb;
    private query: EntityQueryBuilder;
    private cache: RenderingCache;

    constructor(cache: RenderingCache, db: EntityReadDb, level: number) {
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
