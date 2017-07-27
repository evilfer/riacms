import {ServerContext} from "../../app/server-context";
import {ResolvedPageData} from "../page-resolver/server-page-resolver-bundle";
import {ServerRequestContext} from "../server-bundle";

export type RenderPageResult = Promise<{ err: null | Error, stream: null | NodeJS.WritableStream }>;

export function renderPage(serverContext: ServerContext, requestContext: ServerRequestContext): RenderPageResult {

    const storeMap: ({ [name: string]: any }) = serverContext.instantiateStores(requestContext);
    const resolvedPage: ResolvedPageData = storeMap.resolvedPage;

    return Promise.resolve({err: new Error("not implemented"), stream: null});
}
