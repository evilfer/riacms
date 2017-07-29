import * as Promise from "bluebird";
import {useStrict} from "mobx";
import {Provider} from "mobx-react";
import * as React from "react";
import {renderToString} from "react-dom/server";
import {Readable} from "stream";
import {ServerContext} from "../../app/server-context";
import {ServerRequestContext} from "../server-bundle";

useStrict(true);

export interface RenderPageResult {
    err: null | Error;
    stream: null | Readable;
}

export function renderPage(serverContext: ServerContext,
                           requestContext: ServerRequestContext): Promise<RenderPageResult> {

    return requestContext.dataService("resolvedRenderer")
        .then((Renderer: any) => {
            if (Renderer !== null) {
                return serverContext.instantiateStores(requestContext)
                    .then(storeMap => {
                        const element = (
                            <Provider {...storeMap}>
                                <Renderer/>
                            </Provider>
                        );

                        const html = renderToString(element);
                        const stream: Readable = new Readable();
                        stream.push(html);
                        stream.push(null);

                        return {err: new Error("No renderer"), stream} as RenderPageResult;
                    });
            } else {
                return {err: new Error("No renderer"), stream: null} as RenderPageResult;
            }
        });
}
