import {ResolvedPageData} from "../../../common/bundles/page-resolver/resolved-page-data";
import {Template} from "../../../common/bundles/site-renderer/template";
import {TypeManagerBuilder} from "../../../common/types/type-manager-builder";
import {ServerBundle, ServerBundleDataInit, ServerBundleDataInitMap, ServerRequestContext} from "../server-bundle";

export class BasicRendererResolverBundle extends ServerBundle {
    private renderers: { [name: string]: Template };

    public constructor(renderers: { [name: string]: Template } = {}) {
        super();
        this.renderers = renderers;
    }

    public getName(): string {
        return "basicRendererResolver";
    }

    public setRenderers(renderers: { [name: string]: Template }) {
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
