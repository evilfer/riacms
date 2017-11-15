import {EntityFinderStore} from "../../../common/bundles/entity-finder/entity-finder-data";
import {ClientBundle} from "../client-bundle";
import {ClientSiteTreeStore} from "./client-site-tree-store";

export class ClientSiteTreeBundle extends ClientBundle {
    public getName(): string {
        return "siteTree";
    }

    public createStores(storeMap: { [name: string]: any }): null | { [name: string]: any } {
        const {cache} = this.clientContext;
        const store = new ClientSiteTreeStore(cache, storeMap.entityFinder as EntityFinderStore);

        return {
            siteTree: store,
        };
    }
}
