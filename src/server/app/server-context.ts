import * as Promise from "bluebird";
import {TypeManager} from "../../common/types/type-manager";
import {ServerRequestContext} from "../bundles/server-bundle";
import {EntityDb} from "../orm/entity-db";

export type InstantiateStores = (context: ServerRequestContext) => Promise<({ [name: string]: any })>;

export interface ServerContext {
    db: EntityDb;
    types: TypeManager;
    instantiateStores: InstantiateStores;
    dataService: (name: string, context: ServerRequestContext) => Promise<any>;
}
