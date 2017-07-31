import * as Promise from "bluebird";
import {Router} from "express";
import {Bundle, CmsRequest} from "../../common/bundles/bundle";
import {ServerContext} from "../app/server-context";
import {RenderingCache} from "../orm/cache";

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

export abstract class ServerBundle extends Bundle {
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
}

export function genReqDataService(serverContext: ServerContext,
                                  requestContext: ServerRequestContext): (name: string) => Promise<ServiceData> {

    const initialized: { [name: string]: any } = {};

    return (name: string) => {
        if (typeof initialized[name] !== "undefined") {
            return Promise.resolve(initialized[name]);
        } else {
            return serverContext.dataService(name, requestContext)
                .then(data => {
                    initialized[name] = data;
                    return data;
                });
        }
    };
}
