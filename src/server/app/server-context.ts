import {TypeManager} from "../../common/types/type-manager";
import {ServerRequestContext} from "../bundles/server-bundle";
import {EntityDb} from "../orm/entity-db";

export type InstantiateStores = (context: ServerRequestContext) => ({ [name: string]: any });

export interface ServerContext {
    db: EntityDb;
    types: TypeManager;
    instantiateStores: InstantiateStores;
}
