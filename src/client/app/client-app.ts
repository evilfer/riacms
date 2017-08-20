import {runInAction} from "mobx";
import {CmsApp} from "../../common/app/app";
import {ClientBundle} from "../bundles/client-bundle";
import {ClientBundleGroup} from "../bundles/client-bundle-group";
import {ClientCache} from "../cache/client-cache";
import {ClientContext} from "./client-context";
import {ClientData, parseInitialData} from "./initial-data";

export class ClientApp extends CmsApp<ClientBundle> {
    private context: ClientContext;

    public launch(): void {
        this.prepareContext();
        this.bundles.forEach(bundle => bundle.launch());
    }

    private prepareContext(): void {
        const bundles = new ClientBundleGroup(this.bundles);
        const cache = new ClientCache();

        const loadData: (data: ClientData) => void = (data: ClientData) => {
            runInAction(() => {
                cache.loadAssets(data.a);
                bundles.loadStoreData(data.s);
            });
        };

        loadData(parseInitialData());

        this.context = {
            bundles,
            cache,
            loadData,
            types: this.types,
        };

        this.bundles.forEach(bundle => bundle.setClientContext(this.context));
    }
}
