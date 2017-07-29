import * as Promise from "bluebird";
import {useStrict} from "mobx";
import {Provider} from "mobx-react";
import * as React from "react";
import {renderToString} from "react-dom/server";
import {Readable} from "stream";
import {ServerContext} from "../../app/server-context";
import {ServerRequestContext} from "../server-bundle";
import {RenderingCache} from "../../orm/cache";

useStrict(true);

export interface RenderPageResult {
    err: null | Error;
    stream: null | Readable;
}

function tryToRender(cache: RenderingCache,
                     storeMap: { [name: string]: any },
                     Renderer: any): Promise<{ err: null | Error, html: null | string }> {
    try {
        const element = (
            <Provider {...storeMap}>
                <Renderer/>
            </Provider>
        );

        const html = renderToString(element);
        return Promise.resolve({err: null, html});
    } catch (e) {
        return cache.loadEntities(e.ids)
            .then(() => tryToRender(cache, storeMap, Renderer));
    }
}

export function renderPage(serverContext: ServerContext,
                           requestContext: ServerRequestContext): Promise<RenderPageResult> {

    return requestContext.dataService("resolvedRenderer")
        .then((Renderer: any) => {
            if (Renderer !== null) {
                return serverContext.instantiateStores(requestContext)
                    .then(storeMap => tryToRender(requestContext.cache, storeMap, Renderer))
                    .then(({err, html}) => {
                        if (html !== null) {
                            const stream: Readable = new Readable();
                            stream.push(html);
                            stream.push(null);

                            return {err: null, stream} as RenderPageResult;
                        } else {
                            return {err, stream: null};
                        }
                    });
            } else {
                return {err: new Error("No renderer"), stream: null} as RenderPageResult;
            }
        });
}
