import {TypeManager} from "../../common/types/type-manager";
import {ServerBundleGroup} from "../bundles/server-bundle-group";
import {EntityReadDb} from "../orm/entity-db";

export interface ServerContext {
    db: EntityReadDb;
    types: TypeManager;
    bundles: ServerBundleGroup;
}
