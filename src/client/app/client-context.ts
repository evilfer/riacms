import {TypeManager} from "../../common/types/type-manager";
import {ClientBundleGroup} from "../bundles/client-bundle-group";
import {ClientCache} from "../cache/client-cache";
import {ClientErrorManager} from "./client-error-manager";

export interface ClientContext {
    cache: ClientCache;
    bundles: ClientBundleGroup;
    types: TypeManager;
    errors: ClientErrorManager;
}
