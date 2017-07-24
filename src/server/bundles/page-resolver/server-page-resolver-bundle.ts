import {ServerBundle, ServerBundleStores, ServerRequestContext} from "../server-bundle";
import {resolvePage} from "./resolve-page";

export interface ResolvedPageData {
    site: null | any;
    page: null | any;
    route: any[];
    found: boolean;
}

export interface ServerPageResolverBundleStores extends ServerBundleStores {
    resolvedPage: (context: ServerRequestContext) => Promise<ResolvedPageData>;
}

export class ServerPageResolverBundle extends ServerBundle {
    public getName(): string {
        return "serverPageResolver";
    }

    public declareRenderingStores(): ServerPageResolverBundleStores {
        return {
            resolvedPage: resolvePage,
        };
    }
}
