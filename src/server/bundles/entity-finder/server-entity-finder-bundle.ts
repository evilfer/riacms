import * as Promise from "bluebird";
import {ExchangeStoreData} from "../../../common/app/exchange-data";
import {EntityFinderStore} from "../../../common/bundles/entity-finder/entity-finder-data";
import {ServerBundle, ServerBundleDataInitMap, ServerRequestContext} from "../server-bundle";
import {EntityFinder} from "./entity-finder";

export interface ServerEntityFinderBundleStores extends ServerBundleDataInitMap {
    entityFinder: (context: ServerRequestContext) => Promise<EntityFinderStore>;
}

export class ServerEntityFinderBundle extends ServerBundle {
    public getName(): string {
        return "entityFinder";
    }

    public declareRenderingStores(): ServerEntityFinderBundleStores {
        return {
            entityFinder: (context: ServerRequestContext) => Promise.resolve(new EntityFinder(context.cache)),
        };
    }

    public storeData2client(name: string, data: any): null | ExchangeStoreData {
        if (name === "entityFinder") {
            return (data as EntityFinder).storeData2client();
        }

        return null;
    }
}
