/* tslint:disable */
import {expect} from "chai";
import * as React from "react";
import {SiteTypesBundle} from "../../../../src/common/bundles/site-types/site-types-bundle";
import {TypeManager} from "../../../../src/common/types/type-manager";
import {TypeManagerBuilder} from "../../../../src/common/types/type-manager-builder";
import {ServerContext} from "../../../../src/server/app/server-context";
import {ServerPageResolverBundle} from "../../../../src/server/bundles/page-resolver/server-page-resolver-bundle";
import {createFixtureServerContext} from "../../utils/fixture-server-context";
import {fixtures} from "./site-fixtures";
import {RenderingCache} from "../../../../src/server/orm/cache";
import {ServerBundle, ServerRequestContext} from "../../../../src/server/bundles/server-bundle";
import {BasicRendererResolverBundle} from "../../../../src/server/bundles/basic-renderer-resolver/basic-renderer-resolver-bundle";
import {renderPage} from "../../../../src/server/bundles/site-renderer/render-page";


function R1() {
    return <div>Hello world</div>;
}

describe("page renderer", () => {
    let context: ServerContext;

    const renderUrl = (url: string) => {
        const cache = new RenderingCache(context.types, context.db, 0);
        const requestContext: ServerRequestContext = {
            cache,
            dataService: (name: string) => context.dataService(name, requestContext),
            level: 0,
            req: {url},
        };

        return renderPage(context, requestContext)
            .then(({err, stream}) => {
                if (stream !== null) {
                    return new Promise((resolve) => {
                        let data = '';

                        stream.on('data', function (chunk: string) {
                            data += chunk;
                        });


                        stream.on('end', function () {
                            const html = data.replace(/\s?data-react[^\s>]*\s?/g, "");
                            resolve({err: null, html});
                        });
                    });
                } else {
                    return {err, html: null};
                }
            });
    };

    beforeEach(() => {
        const typesBundle: SiteTypesBundle = new SiteTypesBundle();
        const pageResolverBundle = new ServerPageResolverBundle();
        const rendererResolverBundle = new BasicRendererResolverBundle();
        const bundles: ServerBundle[] = [pageResolverBundle, rendererResolverBundle];

        rendererResolverBundle.setRenderers({
            r1: R1
        });

        const builder: TypeManagerBuilder = new TypeManagerBuilder();
        typesBundle.applyTypes(builder);
        rendererResolverBundle.applyTypes(builder);

        const types: TypeManager = builder.build();
        context = createFixtureServerContext(bundles, types, fixtures);
        bundles.forEach(bundle => bundle.setServerContext(context));
    });


    it('should resolve home page by host name/port', () => {
        return renderUrl("http://host1:1000")
            .then(({err, html}) => {
                expect(err).to.be.null;
                expect(html).to.equal("<div>Hello world</div>");
            });
    });
});
