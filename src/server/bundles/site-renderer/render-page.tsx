import * as Promise from "bluebird";
import * as React from "react";
import {Readable} from "stream";
import {adminTemplate} from "../../../common/admin/template/admin-template";
import {ResolvedPageData} from "../../../common/bundles/page-resolver/resolved-page-data";
import {Template} from "../../../common/bundles/site-renderer/template";
import {ServerContext} from "../../app/server-context";
import {ServerRequestContext} from "../server-bundle";
import {renderHtmlTemplate} from "./render-html";

export interface RenderPageResult {
    err: null | Error;
    stream: null | Readable;
}

export function renderPage(serverContext: ServerContext,
                           requestContext: ServerRequestContext,
                           template: Template,
                           onlyJs: boolean): Promise<RenderPageResult> {
    if (template !== null) {
        console.log("render");
        return serverContext.bundles.instantiateStores(requestContext, template.stores)
            .then(storeMap => renderHtmlTemplate(serverContext, requestContext.cache, storeMap, template, onlyJs))
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
                                             requestContext: ServerRequestContext,
                                             onlyJs: boolean): Promise<RenderPageResult> {
    return requestContext.dataService("resolvedRenderer")
        .then((Renderer: Template) => renderPage(serverContext, requestContext, Renderer, onlyJs));
}

export function renderPageOrAdmin(serverContext: ServerContext,
                                  requestContext: ServerRequestContext,
                                  onlyJs: boolean): Promise<RenderPageResult> {
    return requestContext.dataService("resolvedPage")
        .then((resolvedPage: ResolvedPageData) => resolvedPage.admin ?
            renderPage(serverContext, requestContext, adminTemplate, onlyJs) :
            resolveRendererAndRenderPage(serverContext, requestContext, onlyJs));
}
