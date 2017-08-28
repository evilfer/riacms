import {useStrict} from "mobx";
import {CmsApp} from "../../common/app/app";
import {ExchangeData} from "../../common/app/exchange-data";
import {ClientBundle} from "../bundles/client-bundle";
import {ClientBundleGroup} from "../bundles/client-bundle-group";
import {ClientCache} from "../cache/client-cache";
import {ClientContext} from "./client-context";
import {ClientErrorManager} from "./client-error-manager";
import {parseExchangeData} from "./initial-data";

useStrict(true);

export class CmsClientApp extends CmsApp<ClientBundle> {
    private context: ClientContext;

    public launch(): void {
        this.prepareContext();
        this.bundles.forEach(bundle => bundle.launch());
    }

    private prepareContext(): void {
        const bundles = new ClientBundleGroup(this.bundles);
        const cache = new ClientCache(this.types);
        const errors = new ClientErrorManager();

        errors.registerErrorReporter(() => cache.getDataError());

        this.context = {
            bundles,
            cache,
            errors,
            types: this.types,
        };

        this.bundles.forEach(bundle => bundle.setClientContext(this.context));

        const clientData: ExchangeData = parseExchangeData();

        cache.loadEntities(clientData.e);
        bundles.loadStoreData(clientData.s);
    }
}
