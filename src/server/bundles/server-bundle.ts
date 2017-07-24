import {Bundle} from "../../common/bundles/bundle";
import {ServerContext} from "../app/server-context";
import {RenderingCache} from "../orm/cache";

export interface ServerRequestContext {
    cache: RenderingCache;
    level: number;
    req: {
        url: string
    };
}

export interface ServerBundleStores {
    [name: string]: (context: ServerRequestContext) => any;
}

export abstract class ServerBundle extends Bundle {
    protected serverContext: ServerContext;

    public setServerContext(context: ServerContext) {
        this.serverContext = context;
    }

    public prepareRoutes() {
        return;
    }

    public declareRenderingStores(): null | ServerBundleStores {
        return null;
    }
}
