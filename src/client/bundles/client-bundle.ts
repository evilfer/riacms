import {Bundle} from "../../common/bundles/bundle";
import {ClientContext} from "../app/client-context";

export abstract class ClientBundle extends Bundle {
    protected clientContext: ClientContext;

    public setClientContext(context: ClientContext) {
        this.clientContext = context;
    }

    public createStores(): null | { [name: string]: any } {
        return null;
    }

    public loadStoreData(name: string, store: any, data: any): void {
        return;
    }

    public launch(): void {
        return;
    }
}
