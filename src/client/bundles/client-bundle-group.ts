import {ExchangeStoreDataMap} from "../../common/app/exchange-data";
import {ClientBundle} from "./client-bundle";

export class ClientBundleGroup {
    private bundles: ClientBundle[];
    private stores: { [name: string]: any };
    private storeOwner: { [name: string]: ClientBundle };

    constructor(bundles: ClientBundle[]) {
        this.bundles = bundles;
    }

    public getStores(): { [name: string]: any } {
        if (!this.stores) {
            this.prepareStores();
        }
        return this.stores;
    }

    public getStore(name: string) {
        if (!this.stores) {
            this.prepareStores();
        }
        return this.stores[name];
    }

    public loadStoreData(storeData: ExchangeStoreDataMap): void {
        this.getStores();
        Object.keys(storeData)
            .forEach(name => this.storeOwner[name].loadStoreData(name,
                this.stores[name],
                storeData[name]));
    }

    private prepareStores(): void {
        this.storeOwner = {};
        this.stores = {};

        this.bundles.forEach(bundle => {
            const stores = bundle.createStores(this.stores);
            if (stores !== null) {
                Object.keys(stores).forEach(name => {
                    this.stores[name] = stores[name];
                    this.storeOwner[name] = bundle;
                });
            }
        });
    }
}
