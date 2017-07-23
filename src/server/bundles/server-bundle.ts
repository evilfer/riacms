import {Bundle} from "../../common/bundles/bundle";
import {ServerContext} from "../app/server-context";

export abstract class ServerBundle extends Bundle {
    protected serverContext: ServerContext;

    public setServerContext(context: ServerContext) {
        this.serverContext = context;
    }

    public prepareRoutes() {
        return;
    }

    public declareStores(): null | { [name: string]: () => any } {
        return null;
    }
}
