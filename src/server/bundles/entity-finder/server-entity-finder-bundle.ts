import * as Promise from "bluebird";
import {EntityFinderStore} from "../../../common/bundles/entity-finder/entity-finder-data";
import {ServerBundle, ServerBundleDataInitMap, ServerRequestContext} from "../server-bundle";
import {EntityFinder} from "./entity-finder";

export interface ServerEntityFinderBundleStores extends ServerBundleDataInitMap {
    entityFinder: (context: ServerRequestContext) => Promise<EntityFinderStore>;
}

export class ServerEntityFinderBundle extends ServerBundle {
    public getName(): string {
        return "serverPageResolver";
    }

    public declareRenderingStores(): ServerEntityFinderBundleStores {
        return {
            entityFinder: () => Promise.resolve(new EntityFinder()),
        };
    }
}
