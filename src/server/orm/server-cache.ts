import * as Promise from "bluebird";
import {RiaCache} from "../../common/cache/cache";
import {EntityContent} from "../../common/cache/entity-content";
import {TypeManager} from "../../common/types/type-manager";
import {Entity, getEntityContent} from "../entity/entity";
import {CacheMissingError} from "./cache-missing-error";
import {CacheQueryBuilder} from "./cache-query-builder";
import {EntityReadDb} from "./entity-db";
import {createEntityProxy} from "./server-proxy";

export interface CacheEntity {
    entity: Entity;
    content: EntityContent;
    proxy: any;
}

export class RenderingCache extends RiaCache {
    private level: number;
    private db: EntityReadDb;
    private entities: { [id: number]: CacheEntity };
    private usedMap: { [id: number]: any };

    constructor(types: TypeManager, db: EntityReadDb, level = 0) {
        super(types);

        this.level = level;
        this.db = db;
        this.entities = {};
        this.usedMap = {};
    }

    public getLevel(): number {
        return this.level;
    }

    public loadEntity(id: number): Promise<CacheEntity> {
        if (this.entities[id]) {
            return Promise.resolve(this.entities[id]);
        } else {
            return this.db.load(id)
                .then(entity => this.addEntity(entity));
        }
    }

    public loadEntities(ids: number[]): Promise<CacheEntity[]> {
        const needed: number[] = ids.filter(id => !this.entities[id]);

        return this.db.loadMultiple(needed)
            .then((entities: Entity[]) => {
                this.addEntities(entities);
                return ids.map(id => this.entities[id]);
            });
    }

    public addEntity(entity: Entity): CacheEntity {
        if (!this.entities[entity.id]) {
            const content = getEntityContent(entity, this.level);
            const used = {};
            const proxy = createEntityProxy(this, content, used, entity);

            this.entities[entity.id] = {entity, content, proxy};
            this.usedMap[entity.id] = used;
        }

        return this.entities[entity.id];
    }

    public addEntities(entities: Entity[]): CacheEntity[] {
        return entities.map(entity => this.addEntity(entity));
    }

    public getProxy(id: number): any {
        if (!this.entities[id]) {
            this.fireMissingError([id]);
        }

        return this.entities[id].proxy;
    }

    public getProxies(ids: number[]): any[] {
        const missing = ids.filter(id => !this.entities[id]);
        if (missing.length > 0) {
            this.fireMissingError(missing);
        }

        return ids.map(id => this.entities[id].proxy);
    }

    public getUsed(ids: number[]): any[] {
        const missing = ids.filter(id => !this.entities[id]);
        if (missing.length > 0) {
            this.fireMissingError(missing);
        }

        return ids.map(id => this.usedMap[id]);
    }

    public find(): CacheQueryBuilder {
        return new CacheQueryBuilder(this, this.db, this.level);
    }

    public getClientEntities(): { [id: number]: any } {
        return this.usedMap;
    }

    private fireMissingError(ids: number[]): never {
        throw new CacheMissingError(ids);
    }
}
