import * as Promise from "bluebird";
import {ResolvedPageData} from "../../../common/bundles/page-resolver/resolved-page-data";
import {ServerBundle, ServerBundleDataInitMap, ServerRequestContext} from "../server-bundle";
import {resolvePage} from "./resolve-page";

export interface ServerPageResolverBundleStores extends ServerBundleDataInitMap {
    resolvedPage: (context: ServerRequestContext) => Promise<ResolvedPageData>;
}

export class ServerPageResolverBundle extends ServerBundle {
    public getName(): string {
        return "serverPageResolver";
    }

    public declareRequestDataServices(): ServerPageResolverBundleStores {
        return {
            resolvedPage: resolvePage,
        };
    }

    public declareRenderingStores(): ServerPageResolverBundleStores {
        return {
            resolvedPage: (context: ServerRequestContext) => context.dataService("resolvedPage")
                .then((data: ResolvedPageData) => Promise.resolve({
                    admin: data.admin,
                    found: data.found,
                    level: data.level,
                    loading: false,
                    page: data.page && data.page.proxy,
                    route: data.route.map(({proxy}) => proxy),
                    site: data.site && data.site.proxy,
                    ssl: data.ssl,
                })),
        };
    }

    public storeData2client(name: string, data: any): any {
        switch (name) {
            case "resolvedPage":
                return {
                    found: data.found,
                    page: data.page.__id,
                    route: data.route.map((page: any) => page.__id),
                    site: data.site.__id,
                };
        }
        return null;
    }

}
