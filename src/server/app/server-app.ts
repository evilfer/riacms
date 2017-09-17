import {Express, Router} from "express";
import {CmsApp} from "../../common/app/app";
import {ServerBundle} from "../bundles/server-bundle";
import {ServerBundleGroup} from "../bundles/server-bundle-group";
import {ServerTypeManagerBuilder} from "../entity/server-types";
import {EntityReadDb} from "../orm/entity-db";
import {createExpressApp} from "./express-app";
import {listen} from "./listen";
import {ServerContext} from "./server-context";

export class CmsServerApp extends CmsApp<ServerTypeManagerBuilder, ServerBundle> {
    private app: Express;
    private db: EntityReadDb;
    private bundleGroup: ServerBundleGroup;
    private context: ServerContext;

    public initServerApp(db: EntityReadDb) {
        this.db = db;

        this.prepareContext();
        this.prepareApp();
    }

    public launch(port: number) {
        listen(this.app, port);
    }

    protected prepareTypeBuilder(): ServerTypeManagerBuilder {
        return new ServerTypeManagerBuilder();
    }

    private prepareContext(): void {
        this.bundleGroup = new ServerBundleGroup(this.bundles);
        this.context = {
            bundles: this.bundleGroup,
            db: this.db,
            types: this.types,
        };

        this.bundles.forEach(bundle => bundle.setServerContext(this.context));
    }

    private prepareApp(): void {
        const routers: Router[] = this.bundles
            .map(bundle => bundle.prepareRoutes())
            .filter(router => router !== null) as Router[];

        this.app = createExpressApp(routers);
    }
}
