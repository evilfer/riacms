import {ClientBundle} from "../client-bundle";
import {ClientEntityFinderStore} from "./entity-finder-store";

export class ClientEntityFinderBundle extends ClientBundle {
    public getName(): string {
        return "entityFinder";
    }

    public createStores(): null | { [name: string]: any } {
        const {cache, errors} = this.clientContext;
        const store = new ClientEntityFinderStore(cache);
        errors.registerErrorReporter(() => store.getError());

        return {
            entityFinder: store,
        };
    }

    public loadStoreData(name: string, store: any, data: any): void {
        if (name === "entityFinder") {
            (store as ClientEntityFinderStore).loadStoreData(data);
        }
    }
}
