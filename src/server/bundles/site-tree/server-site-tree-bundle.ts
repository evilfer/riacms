import * as Promise from "bluebird";
import {ExchangeStoreData} from "../../../common/app/exchange-data";
import {EntityFinderStore} from "../../../common/bundles/entity-finder/entity-finder-data";
import {SiteTreeStore} from "../../../common/bundles/site-tree/site-tree-data";
import {EntityFinder} from "../entity-finder/entity-finder";
import {ServerBundle, ServerBundleStoreInitMap, ServerRequestContext, ServiceData} from "../server-bundle";
import {ServerSiteTreeStore} from "./server-site-tree-store";

export interface ServerSiteTreeBundleStores extends ServerBundleStoreInitMap {
    siteTree: (context: ServerRequestContext, storeMap: { [name: string]: ServiceData }) => Promise<SiteTreeStore>;
}

export class ServerSiteTreeBundle extends ServerBundle {
    public getName(): string {
        return "siteTree";
    }

    public declareRenderingStores(): ServerSiteTreeBundleStores {
        return {
            siteTree: (context: ServerRequestContext, storeMap: { [name: string]: ServiceData }) =>
                Promise.resolve(new ServerSiteTreeStore(context.cache, storeMap.entityFinder as EntityFinderStore)),
        };
    }

    public storeData2client(name: string, data: any): null | ExchangeStoreData {
        if (name === "entityFinder") {
            return (data as EntityFinder).storeData2client();
        }

        return null;
    }
}
