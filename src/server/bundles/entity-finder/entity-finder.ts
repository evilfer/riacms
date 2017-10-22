import {ExchangeStoreData} from "../../../common/app/exchange-data";
import {
    EntityByIdData,
    EntityFinderData,
    EntityFinderStore,
    queryHash,
} from "../../../common/bundles/entity-finder/entity-finder-data";
import {RenderEntity} from "../../../common/cache/entity-content";
import {RenderingCache} from "../../orm/server-cache";
import {EntityFinderError} from "./entity-finder-error";

export class EntityFinder implements EntityFinderStore {
    private cache: RenderingCache;
    private hashCache: { [queryStr: string]: RenderEntity[] } = {};
    private nameCache: { [queryStr: string]: string } = {};

    constructor(cache: RenderingCache) {
        this.cache = cache;
    }

    public byId(id: number): EntityByIdData {
        return {
            entity: this.cache.getProxy(id),
            loading: false,
        };
    }

    public find(name: string, query: { [field: string]: number | boolean | string }): EntityFinderData {
        const hash = queryHash(query);
        this.nameCache[name] = hash;

        if (this.hashCache[hash]) {
            return {
                data: this.hashCache[hash],
                loading: false,
            };
        } else {
            throw new EntityFinderError(name, hash, query, this.hashCache);
        }
    }

    public storeData2client(): ExchangeStoreData {
        return {
            n: this.nameCache,
            q: Object.keys(this.hashCache).reduce((acc, hash) => {
                acc[hash] = this.hashCache[hash].map(({__id}) => __id as number);
                return acc;
            }, {} as { [query: string]: number[] }),
        };
    }
}
