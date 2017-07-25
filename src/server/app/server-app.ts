import {Express, Router} from "express";
import {CmsApp} from "../../common/app/app";
import {Bundle} from "../../common/bundles/bundle";
import {ServerBundle, ServerBundleStoreInit} from "../bundles/server-bundle";
import {EntityDb} from "../orm/entity-db";
import {createExpressApp} from "./express-app";
import {ServerContext} from "./server-context";

export class CmsServerApp extends CmsApp {
    private serverBundles: ServerBundle[];
    private app: Express;
    private db: EntityDb;
    private context: ServerContext;
    private declaredStores: Array<{ name: string, init: ServerBundleStoreInit }>;

    public constructor(bundles: Bundle[], db: EntityDb) {
        super(bundles);

        this.db = db;

        this.serverBundles = bundles
            .filter(bundle => bundle instanceof ServerBundle)
            .map(bundle => bundle as ServerBundle);

        this.prepareStores();
        this.prepareContext();
        this.prepareApp();
    }

    private prepareStores(): void {
        this.declaredStores = this.serverBundles.reduce((acc, bundle) => {
            const stores = bundle.declareRenderingStores();
            if (stores !== null) {
                Object.keys(stores).forEach(name => acc.push({name, init: stores[name]}));
            }
            return acc;
        }, [] as Array<{ name: string, init: ServerBundleStoreInit }>);
    }

    private prepareContext(): void {
        this.context = {
            db: this.db,
            instantiateStores: context => this.declaredStores.reduce((acc, {name, init}) => {
                acc[name] = init(context);
                return acc;
            }, {} as ({ [name: string]: any })),
            types: this.types,
        };

        this.serverBundles.forEach(bundle => bundle.setServerContext(this.context));
    }

    private prepareApp(): void {
        const routers: Router[] = this.serverBundles
            .map(bundle => bundle.prepareRoutes())
            .filter(router => !!router) as Router[];

        this.app = createExpressApp(routers);
    }
}
