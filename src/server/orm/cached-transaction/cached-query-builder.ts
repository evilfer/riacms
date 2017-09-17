import * as Promise from "bluebird";
import {Entity} from "../../entity/entity";
import {EntityDbFindValues, EntityQueryBuilder, EntityReadDb} from "../entity-db";

export class CachedQueryBuilder implements EntityQueryBuilder {
    private dbBuilder: EntityQueryBuilder;
    private cache: { [id: number]: Entity };

    constructor(cache: { [id: number]: Entity }, db: EntityReadDb, level: number) {
        this.cache = cache;
        this.dbBuilder = db.find(level);
    }

    public run(): Promise<Entity[]> {
        return this.dbBuilder.run()
            .then(entities => {
                return entities.map(entity => {
                    if (!this.cache[entity.id]) {
                        this.cache[entity.id] = entity;
                    }

                    return this.cache[entity.id];
                });
            });
    }

    public idIn(ids: number[]): EntityQueryBuilder {
        this.dbBuilder.idIn(ids);
        return this;
    }

    public implementsType(type: string): EntityQueryBuilder {
        this.dbBuilder.implementsType(type);
        return this;
    }

    public valueEquals(type: string, field: string, value: EntityDbFindValues): EntityQueryBuilder {
        this.dbBuilder.valueEquals(type, field, value);
        return this;
    }

    public valueIn(type: string, field: string, values: EntityDbFindValues[]): EntityQueryBuilder {
        this.dbBuilder.valueIn(type, field, values);
        return this;
    }

    public arrayContains(type: string, field: string, value: EntityDbFindValues): EntityQueryBuilder {
        this.dbBuilder.arrayContains(type, field, value);
        return this;
    }

    public arrayContainsAny(type: string, field: string, values: EntityDbFindValues[]): EntityQueryBuilder {
        this.dbBuilder.arrayContainsAny(type, field, values);
        return this;
    }
}
