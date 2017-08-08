import * as Promise from "bluebird";
import * as React from "react";
import {Readable} from "stream";
import {Template} from "../../../common/bundles/site-renderer/template";
import {ServerContext} from "../../app/server-context";
import {ServerRequestContext} from "../server-bundle";
import {renderHtmlTemplate} from "./render-html";
import {ResolvedPageData} from "../../../common/bundles/page-resolver/resolved-page-data";
import {adminTemplate} from "../../../common/admin/template/admin-template";

export interface RenderPageResult {
    err: null | Error;
    stream: null | Readable;
}

export function renderPage(serverContext: ServerContext,
                           requestContext: ServerRequestContext,
                           Renderer: Template): Promise<RenderPageResult> {
    if (Renderer !== null) {
        console.log("render");
        return serverContext.instantiateStores(requestContext)
            .then(storeMap => renderHtmlTemplate(requestContext.cache, storeMap, Renderer))
            .then(({err, html}) => {
                if (html !== null) {
                    const stream: Readable = new Readable();
                    stream.push(html);
                    stream.push(null);

                    return {err: null, stream};
                } else {
                    return {err, stream: null};
                }
            });
    } else {
        return Promise.resolve({err: new Error("No renderer"), stream: null});
    }
}

export function resolveRendererAndRenderPage(serverContext: ServerContext,
                                             requestContext: ServerRequestContext): Promise<RenderPageResult> {
    return requestContext.dataService("resolvedRenderer")
        .then((Renderer: Template) => renderPage(serverContext, requestContext, Renderer));
}

export function renderPageOrAdmin(serverContext: ServerContext,
                                  requestContext: ServerRequestContext): Promise<RenderPageResult> {
    return requestContext.dataService("resolvedPage")
        .then((resolvedPage: ResolvedPageData) => resolvedPage.admin ?
            renderPage(serverContext, requestContext, adminTemplate) :
            resolveRendererAndRenderPage(serverContext, requestContext));
}
