import {TypeDefinition, TypeDefinitionMap} from "../../common/types/types";
import {Entity, EntityContent, getEntityContent} from "../entity/entity";
import {CacheMissingError} from "./cache-missing-error";
import {createEntityProxy} from "./proxy";

export interface CacheDb {
    load: (id: number) => Promise<Entity>;
    loadMultiple: (ids: number[]) => Promise<Entity[]>;
}

export interface CacheEntity {
    entity: Entity;
    content: EntityContent;
    proxy: any;
    used: any;
}

export class RenderingCache {
    private level: number;
    private db: CacheDb;
    private entities: { [id: number]: CacheEntity };
    private missing: number[];
    private types: TypeDefinitionMap;

    constructor(types: TypeDefinitionMap, db: CacheDb, level = 0) {
        this.level = level;
        this.types = types;
        this.db = db;
        this.entities = {};
        this.missing = [];
    }

    public getFields(type: string): TypeDefinition {
        return this.types[type];
    }

    public loadEntity(id: number): Promise<boolean> {
        return this.loadEntities([id]);
    }

    public loadEntities(ids: number[]): Promise<boolean> {
        const needed: number[] = ids.filter(id => !this.entities[id]);

        return this.db.loadMultiple(needed)
            .then((entities: Entity[]) => {
                entities.forEach(entity => {
                    this.entities[entity.id] = this.createCacheEntity(entity);
                });
                return true;
            });
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
            .then(result => {
                this.missing = [];
                return result;
            });
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
