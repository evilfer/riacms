import {applySiteTypes} from "../../../common/bundles/site-types/site-types";
import {ServerTypeManagerBuilder} from "../../entity/server-types";
import {ServerBundle} from "../server-bundle";
import {applyServerSiteTypes} from "./server-site-types";

export class ServerSiteTypesBundle extends ServerBundle {
    public getName(): string {
        return "siteTypes";
    }

    public applyTypes(typeBuilder: ServerTypeManagerBuilder): void {
        applySiteTypes(typeBuilder);
        applyServerSiteTypes(typeBuilder);
    }
}
