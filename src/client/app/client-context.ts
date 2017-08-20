import {TypeManager} from "../../common/types/type-manager";
import {ClientBundleGroup} from "../bundles/client-bundle-group";
import {ClientCache} from "../cache/client-cache";
import {ClientData} from "./initial-data";

export interface ClientContext {
    cache: ClientCache;
    bundles: ClientBundleGroup;
    types: TypeManager;
    loadData: (data: ClientData) => void;
}
