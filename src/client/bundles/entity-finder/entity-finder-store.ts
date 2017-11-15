import {action, observable} from "mobx";
import {ExchangeStoreData} from "../../../common/app/exchange-data";
import {
    EntityByIdData,
    EntityFinderData,
    EntityFinderStore,
    queryHash,
} from "../../../common/bundles/entity-finder/entity-finder-data";
import {RenderEntity} from "../../../common/cache/entity-content";
import {ClientCache} from "../../cache/client-cache";
import {ClientEntityFinderError} from "./client-entity-finder-error";

export class ClientEntityFinderStore implements EntityFinderStore {
    private cache: ClientCache;

    @observable.shallow
    private hashCache: Map<string, RenderEntity[]> = new Map();

    @observable.shallow
    private nameCache: Map<string, string> = new Map();

    private failedQueries: { [name: string]: { [field: string]: number | boolean | string } } = {};

    public constructor(cache: ClientCache) {
        this.cache = cache;
    }

    public byId(id: number): EntityByIdData {
        return {
            entity: this.cache.getEntity(id),
            loading: !this.cache.hasEntity(id),
        };
    }

    public find(name: string, query: { [field: string]: number | boolean | string }): EntityFinderData {
        const hash = queryHash(query);
        if (this.hashCache.has(hash)) {
            return {
                data: this.hashCache.get(hash) || [],
                loading: false,
            };
        } else {
            if (!this.failedQueries[name]) {
                this.failedQueries[name] = query;
            }
            const prevHash: undefined | string = this.nameCache.get(name);
            return {
                data: prevHash && this.hashCache.get(prevHash) || [],
                loading: true,
            };
        }
    }

    @action
    public loadStoreData(data: ExchangeStoreData): void {
        const n: { [name: string]: string } = data.n;
        const q: { [name: string]: number[] } = data.q;

        Object.keys(n).forEach(name => this.nameCache.set(name, n[name]));
        Object.keys(q).forEach(hash => {
            this.hashCache.set(hash, this.cache.getEntities(q[hash]));
        });
        return;
    }

    public getError(): null | ClientEntityFinderError {
        const queries = Object.keys(this.failedQueries).map(name => this.failedQueries[name]);
        this.failedQueries = {};
        return queries.length > 0 ? new ClientEntityFinderError(queries) : null;
    }
}
