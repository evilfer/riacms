import * as Promise from "bluebird";
import {TypeManager} from "../../common/types/type-manager";
import {TypeField} from "../../common/types/types";
import {Entity, EntityContent, getEntityContent} from "../entity/entity";
import {CacheMissingError} from "./cache-missing-error";
import {CacheQueryBuilder} from "./cache-query-builder";
import {EntityDb} from "./entity-db";
import {createEntityProxy} from "./proxy";

export interface CacheEntity {
    entity: Entity;
    content: EntityContent;
    proxy: any;
    used: any;
}

export class RenderingCache {
    private level: number;
    private db: EntityDb;
    private entities: { [id: number]: CacheEntity };
    private missing: number[];
    private types: TypeManager;

    constructor(types: TypeManager, db: EntityDb, level = 0) {
        this.level = level;
        this.types = types;
        this.db = db;
        this.entities = {};
        this.missing = [];
    }

    public getLevel(): number {
        return this.level;
    }

    public getFields(type: string): TypeField[] {
        return this.types.getFields(type);
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
            this.entities[entity.id] = this.createCacheEntity(entity);
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
            this.fireMissingError(this.missing);
        }

        return ids.map(id => this.entities[id].used);
    }

    public resume(): Promise<boolean> {
        return this.loadEntities(this.missing)
            .then(() => {
                this.missing = [];
                return true;
            });
    }

    public find(): CacheQueryBuilder {
        return new CacheQueryBuilder(this, this.db, this.level);
    }

    private fireMissingError(ids: number[]): never {
        ids.forEach(id => {
            if (this.missing.indexOf(id) < 0) {
                this.missing.push(id);
            }
        });

        throw new CacheMissingError(this.missing);
    }

    private createCacheEntity(entity: Entity): CacheEntity {
        const content = getEntityContent(entity, this.level);
        const used = {};
        const proxy = createEntityProxy(this, content, used, entity);

        return {entity, content, proxy, used};
    }
}
