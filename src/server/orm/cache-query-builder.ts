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

    public idIn(ids: number[]): CacheQueryBuilder {
        this.query.idIn(ids);
        return this;
    }

    public implementsType(type: string): CacheQueryBuilder {
        this.query.implementsType(type);
        return this;
    }

    public valueEquals(type: string, field: string, value: (any | string | boolean | number)): CacheQueryBuilder {
        this.query.valueEquals(type, field, value);
        return this;
    }

    public valueIn(type: string, field: string, values: Array<any | string | boolean | number>): CacheQueryBuilder {
        this.query.valueIn(type, field, values);
        return this;
    }

    public arrayContains(type: string, field: string, value: (any | string | boolean | number)): CacheQueryBuilder {
        this.query.arrayContains(type, field, value);
        return this;
    }

    public arrayContainsAny(type: string, field: string, values: Array<any | string | boolean | number>): CacheQueryBuilder {
        this.query.arrayContainsAny(type, field, values);
        return this;
    }
}
