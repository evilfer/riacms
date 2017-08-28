import {EntityFinderData, EntityFinderStore, queryHash} from "../../../common/bundles/entity-finder/entity-finder-data";
import {EntityFinderError} from "./entity-finder-error";
import {ExchangeStoreData} from "../../../common/app/exchange-data";
import {RenderEntity} from "../../../common/cache/entity-content";

export class EntityFinder implements EntityFinderStore {
    private hashCache: { [queryStr: string]: RenderEntity[] } = {};
    private nameCache: { [queryStr: string]: string } = {};

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
