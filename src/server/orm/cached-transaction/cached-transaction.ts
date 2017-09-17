import * as Promise from "bluebird";
import {EntityContent} from "../../../common/cache/entity-content";
import {TypeManager} from "../../../common/types/type-manager";
import {Entity} from "../../entity/entity";
import {EntityDb, EntityDbWriteTransaction, EntityQueryBuilder} from "../entity-db";
import {CachedQueryBuilder} from "./cached-query-builder";
import {updateRelated} from "./update-related";

export class CachedTransaction implements EntityDbWriteTransaction {

    public static open(types: TypeManager, db: EntityDb, type: string, uid: number): Promise<CachedTransaction> {
        return db.transaction(type, uid)
            .then(transaction => new CachedTransaction(types, transaction));
    }

    private types: TypeManager;
    private dbTrx: EntityDbWriteTransaction;
    private cache: { [id: number]: Entity };
    private modified: number[];

    private constructor(types: TypeManager, dbTrx: EntityDbWriteTransaction) {
        this.types = types;
        this.dbTrx = dbTrx;
        this.cache = {};
        this.modified = [];
    }

    public createEntity(type: string, data: EntityContent[]): Promise<Entity> {
        return this.dbTrx.createEntity(type, data)
            .then(newEntity => {
                this.cache[newEntity.id] = newEntity;
                return this.updateRelatedEntities(newEntity, [], data);
            });
    }

    public updateEntity(eid: number, data: EntityContent[]): Promise<Entity> {
        return this.load(eid)
            .then(entity => {
                if (this.modified.indexOf(entity.id) < 0) {
                    this.modified.push(entity.id);
                }
                const oldData = entity.data;
                entity.data = data;

                return this.updateRelatedEntities(entity, oldData, data);
            });
    }

    public commit(): Promise<boolean> {
        return Promise.all(this.modified.map(id => this.dbTrx.updateEntity(id, this.cache[id].data)))
            .then(() => this.dbTrx.commit());
    }

    public load(id: number): Promise<Entity> {
        return this.cache[id] ?
            Promise.resolve(this.cache[id]) :
            this.dbTrx.load(id)
                .then(entity => {
                    this.cache[id] = entity;
                    return entity;
                });
    }

    public loadMultiple(ids: number[]): Promise<Entity[]> {
        const missing = ids.filter(id => !this.cache[id]);
        if (missing.length === 0) {
            return Promise.resolve(ids.map(id => this.cache[id]));
        }

        return this.dbTrx.loadMultiple(missing)
            .then(entities => {
                entities.forEach(entity => this.cache[entity.id] = entity);
                return ids.map(id => this.cache[id]);
            });
    }

    public find(level: number): EntityQueryBuilder {
        return new CachedQueryBuilder(this.cache, this.dbTrx, level);
    }

    public getDbTransaction(): EntityDbWriteTransaction {
        return this.dbTrx;
    }

    private updateRelatedEntities(entity: Entity, oldData: EntityContent[], newData: EntityContent[]): Promise<Entity> {
        return updateRelated(this.types, this, entity, oldData, newData);
    }
}
