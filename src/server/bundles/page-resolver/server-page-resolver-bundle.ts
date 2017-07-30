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
                    found: data.found,
                    loading: false,
                    page: data.page && data.page.proxy,
                    route: data.route.map(({proxy}) => proxy),
                    site: data.site && data.site.proxy,
                })),
        };
    }
}
