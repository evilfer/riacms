import {Bundle} from "../../common/bundles/bundle";
import {ClientContext} from "../app/client-context";
import {TypeManagerBuilder} from "../../common/types/type-manager-builder";

export abstract class ClientBundle extends Bundle<TypeManagerBuilder> {
    protected clientContext: ClientContext;

    public setClientContext(context: ClientContext) {
        this.clientContext = context;
    }

    public createStores(storeMap: { [name: string]: any }): null | { [name: string]: any } {
        return null;
    }

    public loadStoreData(name: string, store: any, data: any): void {
        return;
    }

    public launch(): void {
        return;
    }
}
