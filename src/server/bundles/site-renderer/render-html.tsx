import * as Promise from "bluebird";
import {useStrict} from "mobx";
import {Provider} from "mobx-react";
import * as React from "react";
import {renderToString} from "react-dom/server";
import {Helmet} from "react-helmet";
import {ServerStyleSheet} from "styled-components";
import {Template} from "../../../common/bundles/site-renderer/template";
import {RenderingCache} from "../../orm/cache";
import {ServerDataError} from "../../server-data-error";

useStrict(true);

export function renderHtmlTemplate(cache: RenderingCache,
                                   storeMap: { [name: string]: any },
                                   template: Template): Promise<{ err: null | Error, html: null | string }> {
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
        const body = renderToString(elementToRender);
        const helmet = Helmet.renderStatic();
        const styledComponentsCss = sheet ? sheet.getStyleTags() : "";

        const html = `
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
                    <div id="root">
                        ${body}
                    </div>
                    ${helmet.link.toString()}
                </body>
            </html>
        `;

        return Promise.resolve({err: null, html});
    } catch (e) {
        console.log("  failed:", e.message);
        if (e instanceof ServerDataError) {
            return (e as ServerDataError).loadData(cache)
                .then(err => err ? {err, html: null} : renderHtmlTemplate(cache, storeMap, template));
        } else {
            return Promise.resolve({err: e, html: null});
        }
    }
}
