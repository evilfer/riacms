import {ClientBundle} from "./client-bundle";
import {ClientStoreData} from "../app/initial-data";

export class ClientBundleGroup {
    private bundles: ClientBundle[];
    private stores: { [name: string]: any };
    private storeOwner: { [name: string]: ClientBundle };

    constructor(bundles: ClientBundle[]) {
        this.bundles = bundles;

        this.prepareStores();
    }

    public getStores(): { [name: string]: any } {
        return this.stores;
    }

    public loadStoreData(storeData: ClientStoreData): void {
        Object.keys(storeData)
            .forEach(name => this.storeOwner[name].loadStoreData(name, storeData[name]));
    }

    private prepareStores(): void {
        this.storeOwner = {};
        this.stores = {};

        this.bundles.forEach(bundle => {
            const stores = bundle.createStores();
            if (stores !== null) {
                Object.keys(stores).forEach(name => {
                    this.stores[name] = stores[name];
                    this.storeOwner[name] = bundle;
                });
            }
        });
    }
}
