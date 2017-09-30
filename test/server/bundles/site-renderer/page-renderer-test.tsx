/* tslint:disable */
import * as Promise from "bluebird";
import {expect} from "chai";
import * as he from "he";
import * as React from "react";
import {TypeManager} from "../../../../src/common/types/type-manager";
import {ServerContext} from "../../../../src/server/app/server-context";
import {ServerPageResolverBundle} from "../../../../src/server/bundles/page-resolver/server-page-resolver-bundle";
import {createFixtureServerContext} from "../../utils/fixture-server-context";
import {default as applyTestTypes, fixtures} from "./site-fixtures";
import {RenderingCache} from "../../../../src/server/orm/server-cache";
import {ServerBundle, ServerRequestContext} from "../../../../src/server/bundles/server-bundle";
import {BasicRendererResolverBundle} from "../../../../src/server/bundles/basic-renderer-resolver/basic-renderer-resolver";
import {resolveRendererAndRenderPage} from "../../../../src/server/bundles/site-renderer/render-page";
import renderers from "./test-renderers";
import {RequestLocationBundle} from "../../../../src/server/bundles/request-location/request-location-bundle";
import {ServerSiteTypesBundle} from "../../../../src/server/bundles/site-types/server-site-types-bundle";
import {SiteRendererServerBundle} from "../../../../src/server/bundles/site-renderer/site-renderer-server-bundle";
import {ServerRenderingContextBundle} from "../../../../src/server/bundles/rendering-context/server-rendering-context-bundle";
import {ServerTypeManagerBuilder} from "../../../../src/server/entity/server-types";


describe("page renderer", () => {
    let context: ServerContext;

    const createRequestContext = (url: string) => {
        const cache = new RenderingCache(context.types, context.db, 0);
        const requestContext: ServerRequestContext = {
            cache,
            dataService: (name: string) => context.bundles.dataService(name, requestContext),
            level: 0,
            req: {url},
        };

        return requestContext;
    };

    const renderUrl = (url: string) => {
        const requestContext: ServerRequestContext = createRequestContext(url);

        return resolveRendererAndRenderPage(context, requestContext, false)
            .then(({err, stream}) => {
                if (stream !== null) {
                    return new Promise((resolve) => {
                        let data = '';

                        stream.on('data', function (chunk: string) {
                            data += chunk;
                        });

                        stream.on('end', function () {
                            const html = data
                                .replace(/\s?data-react[^\s>]*\s?/g, "")
                                .replace(/<!-- \/?react-text(: [0-9]+)? -->/g, "");

                            const storeDataStr = html.match(/<script type="text\/plain" id="ria-data">(.*)<\/script>/);
                            let storeData = null;
                            try {
                                storeData = storeDataStr ? JSON.parse(he.decode(storeDataStr[1])) : null;
                            } catch (e) {
                                storeData = {};
                            }
                            resolve({err: null, html, storeData});
                        });
                    });
                } else {
                    return {err, html: null};
                }
            });
    };

    beforeEach(() => {
        const renderingContextBundle: ServerRenderingContextBundle = new ServerRenderingContextBundle();
        const typesBundle: ServerSiteTypesBundle = new ServerSiteTypesBundle();
        const locationBundle = new RequestLocationBundle();
        const pageResolverBundle = new ServerPageResolverBundle();
        const rendererResolverBundle = new BasicRendererResolverBundle();
        const siteRendererBundle = new SiteRendererServerBundle();
        const bundles: ServerBundle[] = [renderingContextBundle, locationBundle, pageResolverBundle, rendererResolverBundle, siteRendererBundle];

        rendererResolverBundle.setRenderers(renderers);

        const builder: ServerTypeManagerBuilder = new ServerTypeManagerBuilder();
        typesBundle.applyTypes(builder);
        rendererResolverBundle.applyTypes(builder);
        applyTestTypes(builder);

        const types: TypeManager = builder.build();
        context = createFixtureServerContext(bundles, types, fixtures);
        bundles.forEach(bundle => bundle.setServerContext(context));
    });


    it('should render trivial template', () => {
        return renderUrl("http://host1:1000")
            .then(({err, html}) => {
                expect(err).to.be.null;
                expect(html).to.contain("<div>Hello world</div>");
            });
    });

    it('should render page/sited data in template', () => {
        return renderUrl("http://host2")
            .then(({err, html}) => {
                expect(err).to.be.null;
                expect(html).to.contain("<h1>page21</h1>");
                expect(html).to.contain("<p>At: site2</p>");
            });
    });

    it('should render page/sited data in template with related entities', () => {
        return renderUrl("http://host2/about")
            .then(({err, html}) => {
                expect(err).to.be.null;
                expect(html).to.contain("<h1>page22</h1>");
                expect(html).to.contain("<p>At: site2</p>");
                expect(html).to.contain("<p>Related page: page21</p>");
            });
    });

    it("should provide cache data to client", () => {
        return renderUrl("http://host2/about")
            .then(({err, storeData}) => {
                expect(err).to.be.null;
                expect(storeData).not.to.be.null;
                expect(storeData).to.have.keys("e", "s");
                expect(storeData.e).to.be.an("object");
                expect(storeData.e).to.have.keys([2, 20021, 20022, 22, 21]);
            });
    });

    it("should provide store data to client", () => {
        return renderUrl("http://host2/about")
            .then(({storeData}) => {
                expect(storeData).not.to.be.null;
                expect(storeData.s).to.be.an("object");
                expect(storeData.s.resolvedPage).to.be.an("object");
                expect(storeData.s.resolvedPage).to.deep.eq({
                    found: true,
                    page: 22,
                    path: "about",
                    route: [22],
                    site: 2,
                });
            });
    });

    describe("using render mode", () => {
        it('should provide renderMode store', () => {
            return context.bundles.instantiateStores(createRequestContext("http://host1:1000"), ["dynamicData"])
                .then(stores => {
                    expect(stores).to.be.an("object");
                    expect(stores.dynamicData).to.be.an("object");
                });
        });

        it('should ignore components marked as browser only for rendering', () => {
            return renderUrl("http://host3:1000/")
                .then(({err, html}) => {
                    expect(err).to.be.null;
                    expect(html).to.contain("<div>all contexts</div>");
                    expect(html).not.to.contain("<div>browser only</div>");
                });
        });

    });
});
