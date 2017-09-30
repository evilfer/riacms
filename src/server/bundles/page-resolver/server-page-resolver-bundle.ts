import * as Promise from "bluebird";
import {ExchangeStoreData} from "../../../common/app/exchange-data";
import {ResolvedPageData} from "../../../common/bundles/page-resolver/resolved-page-data";
import {RenderEntity} from "../../../common/cache/entity-content";
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
                    path: data.path,
                    pathSegments: data.pathSegments,
                    route: data.route.map(({proxy}) => proxy),
                    site: data.site && data.site.proxy,
                    ssl: data.ssl,
                })),
        };
    }

    public storeData2client(name: string, data: any): null | ExchangeStoreData {
        switch (name) {
            case "resolvedPage":
                return {
                    found: data.found,
                    page: data.page ? data.page.__id : null,
                    path: data.path,
                    route: data.route.map((page: RenderEntity) => page.__id),
                    site: data.site ? data.site.__id : null,
                };
        }
        return null;
    }

}
