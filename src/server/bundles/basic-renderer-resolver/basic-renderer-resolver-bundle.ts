import {Component} from "react";
import {TypeManagerBuilder} from "../../../common/types/type-manager-builder";
import {ResolvedPageData} from "../page-resolver/server-page-resolver-bundle";
import {ServerBundle, ServerBundleDataInit, ServerBundleDataInitMap, ServerRequestContext} from "../server-bundle";

export type TemplateRenderer = Component<{}, undefined>;

export class BasicPageResolverBundle extends ServerBundle {
    private renderers: { [name: string]: TemplateRenderer };

    public getName(): string {
        return "basicRendererResolver";
    }

    public setRenderers(renderers: { [name: string]: TemplateRenderer }) {
        this.renderers = renderers;
    }

    public applyTypes(builder: TypeManagerBuilder) {
        builder.extendType("site", [{
            name: "renderer",
            type: "string",
        }]);
    }

    public declareRequestDataServices(): ServerBundleDataInitMap {
        const resolvedRenderer: ServerBundleDataInit = (context: ServerRequestContext) => {
            return context.dataService("resolvedPage").then((resolvedPage: ResolvedPageData) => {
                const rendererKey: null | string = (resolvedPage !== null && resolvedPage.site) ?
                    resolvedPage.site.__content.renderer : null;

                const renderer: null | TemplateRenderer = rendererKey && this.renderers[rendererKey] || null;
                return {renderer};
            });
        };

        return {resolvedRenderer};
    }
}
