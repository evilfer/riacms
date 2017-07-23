import {TypeManager} from "../../common/types/type-manager";
import {EntityDb} from "../orm/entity-db";

export interface ServerContext {
    db: EntityDb;
    types: TypeManager;
}
