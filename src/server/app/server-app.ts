import * as Promise from "bluebird";
import {Express, Router} from "express";
import * as extend from "extend";
import {CmsApp} from "../../common/app/app";
import {Bundle} from "../../common/bundles/bundle";
import {
    ServerBundle,
    ServerBundleDataInit,
    ServerBundleDataInitMap,
    ServerRequestContext,
} from "../bundles/server-bundle";
import {EntityDb} from "../orm/entity-db";
import {createExpressApp} from "./express-app";
import {ServerContext} from "./server-context";

export class CmsServerApp extends CmsApp {
    private serverBundles: ServerBundle[];
    private app: Express;
    private db: EntityDb;
    private context: ServerContext;
    private declaredDataServices: ServerBundleDataInitMap;
    private declaredStores: Array<{ name: string, init: ServerBundleDataInit }>;

    public constructor(bundles: Bundle[], db: EntityDb) {
        super(bundles);

        this.db = db;

        this.serverBundles = bundles
            .filter(bundle => bundle instanceof ServerBundle)
            .map(bundle => bundle as ServerBundle);

        this.prepareDataServices();
        this.prepareStores();
        this.prepareContext();
        this.prepareApp();
    }

    private prepareDataServices(): void {
        this.declaredDataServices = this.serverBundles.reduce((acc, bundle) => {
            const services = bundle.declareRenderingStores();
            extend(acc, services);
            return acc;
        }, {} as ServerBundleDataInitMap);
    }

    private prepareStores(): void {
        this.declaredStores = this.serverBundles.reduce((acc, bundle) => {
            const stores = bundle.declareRenderingStores();
            if (stores !== null) {
                Object.keys(stores).forEach(name => acc.push({name, init: stores[name]}));
            }
            return acc;
        }, [] as Array<{ name: string, init: ServerBundleDataInit }>);
    }

    private prepareContext(): void {
        this.context = {
            dataService: (name: string, context: ServerRequestContext) => this.declaredDataServices[name](context),
            db: this.db,
            instantiateStores: context => {
                return Promise.reduce(this.declaredStores, (acc, {name, init}) => {
                    return init(context).then(value => {
                        acc[name] = value;
                        return acc;
                    });
                }, {} as { [name: string]: any });
            },
            types: this.types,
        };

        this.serverBundles.forEach(bundle => bundle.setServerContext(this.context));
    }

    private prepareApp(): void {
        const routers: Router[] = this.serverBundles
            .map(bundle => bundle.prepareRoutes())
            .filter(router => router !== null) as Router[];

        this.app = createExpressApp(routers);
    }
}
