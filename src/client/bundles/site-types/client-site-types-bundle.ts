import {applySiteTypes} from "../../../common/bundles/site-types/site-types";
import {TypeManagerBuilder} from "../../../common/types/type-manager-builder";
import {ClientBundle} from "../client-bundle";

export class ClientSiteTypesBundle extends ClientBundle {
    public getName(): string {
        return "siteTypes";
    }

    public applyTypes(typeBuilder: TypeManagerBuilder): void {
        applySiteTypes(typeBuilder);
    }

    public createStores(): { [name: string]: any } {
        return {
            types: this.clientContext.types,
        };
    }
}
