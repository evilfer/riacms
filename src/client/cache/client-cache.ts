import * as extend from "extend";
import {observable} from "mobx";
import {ExchangeEntityData, ExchangeEntityDataMap} from "../../common/app/exchange-data";
import {RiaCache} from "../../common/cache/cache";
import {RenderEntity} from "../../common/cache/entity-content";
import {TypeManager} from "../../common/types/type-manager";
import {ClientCacheDataError} from "./client-cache-data-error";
import {createEntityProxy} from "./client-proxy";

export interface ClientCacheMissing {
    missing: boolean;
    entities: number[];
    data: { [id: number]: string[] };
}

export class ClientCache extends RiaCache {
    @observable.shallow private entities = new Map<number, { data: ExchangeEntityData, proxy: RenderEntity }>();

    private missing: ClientCacheMissing;

    public constructor(types: TypeManager) {
        super(types);

        this.resetMissing();
    }

    public loadEntities(data: ExchangeEntityDataMap): void {
        Object.keys(data).forEach((idStr: string) => {
            const id: number = parseInt(idStr, 10);
            const cacheEntity = this.entities.get(id);
            const entityData: ExchangeEntityData = cacheEntity ?
                extend(cacheEntity.data, data[id]) : data[id];

            this.entities.set(id, {data: entityData, proxy: createEntityProxy(this, id, entityData)});
        });
    }

    public hasEntity(id: number): boolean {
        return this.entities.has(id);
    }

    public getEntity(id: number): null | RenderEntity {
        if (this.entities.has(id)) {
            return this.entities.get(id)!.proxy;
        }

        this.declareMissingEntity(id);
        return null;
    }

    public getEntities(ids: number[]): RenderEntity[] {
        return ids
            .map(id => this.getEntity(id))
            .filter(e => e !== null) as RenderEntity[];
    }

    public getMissing(): ClientCacheMissing {
        return this.missing;
    }

    public resetMissing(): void {
        this.missing = {
            data: {},
            entities: [],
            missing: false,
        };
    }

    public getDataError(): null | ClientCacheDataError {
        if (!this.missing.missing) {
            return null;
        }

        const error = new ClientCacheDataError(this.missing);
        this.resetMissing();
        return error;
    }

    public declareMissingEntity(id: number) {
        if (this.missing.entities.indexOf(id) < 0) {
            this.missing.entities.push(id);
            this.missing.missing = true;
        }
    }

    public declareMissingData(id: number, field: string) {
        if (!this.missing.data[id]) {
            this.missing.data[id] = [];
        }

        if (this.missing.data[id].indexOf(field)) {
            this.missing.data[id].push(field);
            this.missing.missing = true;
        }
    }
}
