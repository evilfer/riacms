import {TypeManager} from "../../common/types/type-manager";
import {ServerBundleGroup} from "../bundles/server-bundle-group";
import {EntityDb, EntityReadDb} from "../orm/entity-db";

export interface ServerContext {
    db: EntityDb;
    types: TypeManager;
    bundles: ServerBundleGroup;
}
