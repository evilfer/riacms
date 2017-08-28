import * as Promise from "bluebird";
import {ServerContext} from "../app/server-context";
import {RenderingCache} from "../orm/server-cache";
import {ServerRequest, ServerRequestContext, ServiceData} from "./server-bundle";

export class BasicServerRequestContext implements ServerRequestContext {
    public cache: RenderingCache;
    public level: number;
    public req: ServerRequest;
    private initializedData: { [name: string]: any };
    private serverContext: ServerContext;

    constructor(serverContext: ServerContext, cache: RenderingCache, level: number, req: ServerRequest) {
        this.serverContext = serverContext;
        this.cache = cache;
        this.level = level;
        this.req = req;
        this.initializedData = {};
    }

    public dataService(name: string): Promise<ServiceData> {
        if (typeof this.initializedData[name] !== "undefined") {
            return Promise.resolve(this.initializedData[name]);
        } else {
            return this.serverContext.bundles.dataService(name, this)
                .then(data => {
                    this.initializedData[name] = data;
                    return data;
                });
        }
    }
}
