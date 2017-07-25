import {Bundle} from "../../common/bundles/bundle";
import {ServerContext} from "../app/server-context";
import {RenderingCache} from "../orm/cache";
import {Router} from "express";

export interface ServerRequestContext {
    cache: RenderingCache;
    level: number;
    req: {
        url: string,
    };
}

export type ServerBundleStoreInit = (context: ServerRequestContext) => any;

export interface ServerBundleStores {
    [name: string]: ServerBundleStoreInit;
}

export abstract class ServerBundle extends Bundle {
    protected serverContext: ServerContext;

    public setServerContext(context: ServerContext) {
        this.serverContext = context;
    }

    public prepareRoutes(): null | Router {
        return null;
    }

    public declareRenderingStores(): null | ServerBundleStores {
        return null;
    }
}
