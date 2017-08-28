import * as Promise from "bluebird";
import * as he from "he";
import {useStrict} from "mobx";
import {Provider} from "mobx-react";
import * as React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {Helmet} from "react-helmet";
import {ServerStyleSheet} from "styled-components";
import {Template} from "../../../common/bundles/site-renderer/template";
import {ServerContext} from "../../app/server-context";
import {ServerDataError} from "../../app/server-data-error";
import {RenderingCache} from "../../orm/server-cache";

useStrict(true);

export function renderHtmlTemplate(serverContext: ServerContext,
                                   cache: RenderingCache,
                                   storeMap: { [name: string]: any },
                                   template: Template,
                                   onlyJs: boolean): Promise<{ err: null | Error, html: null | string }> {
    console.log("  trying...");
    try {
        const Component: any = template.component;
        const element = (
            <Provider {...storeMap}>
                <Component/>
            </Provider>
        );

        Helmet.rewind();
        const sheet = template.options.styledComponents && new ServerStyleSheet();
        const elementToRender = sheet ? sheet.collectStyles(element) : element;
        const body = renderToStaticMarkup(elementToRender);
        const storeData = serverContext.bundles.storeData2client(storeMap);
        const clientData = JSON.stringify({
            e: cache.getClientEntities(),
            s: storeData,
        });

        let html: string;

        if (!onlyJs) {
            const helmet = Helmet.renderStatic();
            const styledComponentsCss = sheet ? sheet.getStyleTags() : "";
            const jsScripts = (template.options.jsScripts || [])
                .map(file => file.replace(/$\//, ""))
                .map(file => `<script type="text/javascript" src="/_assets/${file}"></script>`)
                .join("");

            html = `
                <!doctype html>
                <html ${helmet.htmlAttributes.toString()}>
                    <head>
                        ${helmet.title.toString()}
                        ${helmet.meta.toString()}
                        ${helmet.link.toString()}
                        ${helmet.style.toString()}
                        ${styledComponentsCss}
                    </head>
                    <body ${helmet.bodyAttributes.toString()}>
                        <div id="root">${template.options.simpleHtml ? "" : body}</div>
                        <script type="text/plain" id="ria-data">${he.encode(clientData)}</script>
                        ${jsScripts}
                    </body>
                </html>
            `;
        } else {
            html = clientData;
        }

        console.log("  done.");
        return Promise.resolve({err: null, html});
    } catch (e) {
        console.log("  failed:", e.message);
        if (e instanceof ServerDataError) {
            return (e as ServerDataError).loadData(cache)
                .then(err => err ? {
                    err,
                    html: null,
                } : renderHtmlTemplate(serverContext, cache, storeMap, template, onlyJs));
        } else {
            return Promise.resolve({err: e, html: null});
        }
    }
}
