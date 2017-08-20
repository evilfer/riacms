import {ServerBundle} from "../server-bundle";
import {TypeManagerBuilder} from "../../../common/types/type-manager-builder";
import {applySiteTypes} from "../../../common/bundles/site-types/site-types";

export class ServerSiteTypesBundle extends ServerBundle {
    public getName(): string {
        return "siteTypes";
    }

    public applyTypes(typeBuilder: TypeManagerBuilder): void {
        applySiteTypes(typeBuilder);
    }
}
