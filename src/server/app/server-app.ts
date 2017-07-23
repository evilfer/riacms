import {CmsApp} from "../../common/app/app";
import {ServerBundle} from "../bundles/server-bundle";

export class CmsServerApp extends CmsApp<ServerBundle> {

    public constructor(bundles: ServerBundle[]) {
        super(bundles);
    }

}
