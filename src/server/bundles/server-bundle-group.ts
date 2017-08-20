import * as Promise from "bluebird";
import * as extend from "extend";
import {ServerBundle, ServerBundleDataInit, ServerBundleDataInitMap, ServerRequestContext} from "./server-bundle";

export class ServerBundleGroup {
    private bundles: ServerBundle[];
    private declaredDataServices: ServerBundleDataInitMap;
    private declaredStores: Array<{ name: string, init: ServerBundleDataInit }>;
    private storeOwner: { [name: string]: ServerBundle };

    constructor(bundles: ServerBundle[]) {
        this.bundles = bundles;

        this.prepareDataServices();
        this.prepareStores();
    }

    public instantiateStores(context: ServerRequestContext): Promise<({ [name: string]: any })> {
        return Promise.reduce(this.declaredStores, (acc, {name, init}) => {
            return init(context).then(value => {
                acc[name] = value;
                return acc;
            });
        }, {} as { [name: string]: any });
    }

    public dataService(name: string, context: ServerRequestContext): Promise<any> {
        return this.declaredDataServices[name](context);
    }

    public storeData2client(storeMap: { [name: string]: any }): { [name: string]: any } {
        return Object.keys(storeMap).reduce((acc, storeName) => {
            const clientData = this.storeOwner[storeName].storeData2client(storeName, storeMap[storeName]);
            if (clientData !== null) {
                acc[storeName] = clientData;
            }
            return acc;
        }, {} as { [name: string]: any });
    }

    private prepareDataServices(): void {
        this.declaredDataServices = this.bundles.reduce((acc, bundle) => {
            const services = bundle.declareRequestDataServices();
            extend(acc, services);
            return acc;
        }, {} as ServerBundleDataInitMap);
    }

    private prepareStores(): void {
        this.storeOwner = {};
        this.declaredStores = [];

        this.bundles.forEach(bundle => {
            const stores = bundle.declareRenderingStores();
            if (stores !== null) {
                Object.keys(stores).forEach(name => {
                    this.declaredStores.push({name, init: stores[name]});
                    this.storeOwner[name] = bundle;
                });
            }
        });
    }
}
