import * as Promise from "bluebird";
import {Router} from "express";
import {Bundle, CmsRequest} from "../../common/bundles/bundle";
import {ServerContext} from "../app/server-context";
import {RenderingCache} from "../orm/server-cache";
import {ExchangeStoreData} from "../../common/app/exchange-data";
import {ServerTypeManagerBuilder} from "../entity/server-types";

export type ServerRequest = CmsRequest;

export interface ServerRequestContext {
    cache: RenderingCache;
    level: number;
    req: ServerRequest;
    dataService: (name: string) => Promise<ServiceData>;
}

export type ServiceData = any;

export type ServerBundleDataInit = (context: ServerRequestContext) => Promise<ServiceData>;

export interface ServerBundleDataInitMap {
    [name: string]: ServerBundleDataInit;
}

export abstract class ServerBundle extends Bundle<ServerTypeManagerBuilder> {
    protected serverContext: ServerContext;

    public setServerContext(context: ServerContext) {
        this.serverContext = context;
    }

    public prepareRoutes(): null | Router {
        return null;
    }

    public declareRequestDataServices(): ServerBundleDataInitMap {
        return {};
    }

    public declareRenderingStores(): ServerBundleDataInitMap {
        return {};
    }

    public storeData2client(name: string, data: any): null | ExchangeStoreData {
        return null;
    }
}
