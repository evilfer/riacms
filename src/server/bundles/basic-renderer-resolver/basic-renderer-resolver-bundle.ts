import {IWrappedComponent} from "mobx-react";
import {Component} from "react";
import {TypeManagerBuilder} from "../../../common/types/type-manager-builder";
import {ResolvedPageData} from "../page-resolver/server-page-resolver-bundle";
import {ServerBundle, ServerBundleDataInit, ServerBundleDataInitMap, ServerRequestContext} from "../server-bundle";

export type TemplateRenderer = Component<{}, undefined> | (() => JSX.Element) | IWrappedComponent<any>;

export class BasicRendererResolverBundle extends ServerBundle {
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
                    resolvedPage.site.content.renderer : null;

                return rendererKey && this.renderers[rendererKey] || null;
            });
        };

        return {resolvedRenderer};
    }
}
