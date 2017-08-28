import {ClientBundle} from "../client-bundle";
import {ClientResolvedPageStore} from "./resolved-page-store";
import {ExchangeStoreData} from "../../../common/app/exchange-data";
import {ResolvedPageExchangeData} from "../../../common/bundles/page-resolver/resolved-page-ex-data";

export class ClientPageResolverBundle extends ClientBundle {
    public getName(): string {
        return "pageResolver";
    }

    public createStores(): null | { [name: string]: any } {
        const {cache, errors} = this.clientContext;
        const requestLocation = this.clientContext.bundles.getStore("location");
        const store = new ClientResolvedPageStore(cache, requestLocation);
        errors.registerErrorReporter(() => store.getError());

        return {
            resolvedPage: store,
        };
    }

    public loadStoreData(name: string, store: any, data: ExchangeStoreData): void {
        if (name === "resolvedPage") {
            (store as ClientResolvedPageStore).loadStoreData(data as ResolvedPageExchangeData);
        }
    }
}
