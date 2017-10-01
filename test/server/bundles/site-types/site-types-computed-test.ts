/* tslint:disable */
import {expect} from "chai";
import {ServerPageResolverBundle} from "../../../../src/server/bundles/page-resolver/server-page-resolver-bundle";
import {RenderingCache} from "../../../../src/server/orm/server-cache";
import {ServerContext} from "../../../../src/server/app/server-context";
import {ServerSiteTypesBundle} from "../../../../src/server/bundles/site-types/server-site-types-bundle";
import {RequestLocationBundle} from "../../../../src/server/bundles/request-location/request-location-bundle";
import {TypeManager} from "../../../../src/common/types/type-manager";
import {fixtures} from "../site-fixtures";
import {createFixtureServerContext} from "../../utils/fixture-server-context";
import {ServerRequestContext} from "../../../../src/server/bundles/server-bundle";
import {ServerTypeManagerBuilder} from "../../../../src/server/entity/server-types";
import {ServerDataError} from "../../../../src/server/app/server-data-error";

describe("server site types computed fields", () => {
    let context: ServerContext;
    let cache: RenderingCache;
    let initRequestContext: (url: string) => ServerRequestContext;

    beforeEach(() => {
        const typesBundle: ServerSiteTypesBundle = new ServerSiteTypesBundle();
        const locationBundle = new RequestLocationBundle();
        const resolverBundle = new ServerPageResolverBundle();

        const builder: ServerTypeManagerBuilder = new ServerTypeManagerBuilder();
        typesBundle.applyTypes(builder);
        const types: TypeManager = builder.build();
        context = createFixtureServerContext([locationBundle, resolverBundle], types, fixtures);
        [locationBundle, resolverBundle].forEach(bundle => bundle.setServerContext(context));
        cache = new RenderingCache(types, context.db, 0);
        initRequestContext = url => {
            const requestContext: ServerRequestContext = {
                cache,
                dataService: name => context.bundles.dataService(name, requestContext),
                level: 0,
                req: {url},
            };
            cache.setContext(context, requestContext);
            return requestContext;
        };
    });

    describe("has children", () => {
        it("should return true for pages with children", () => {
            return cache.loadEntity(1)
                .then(({proxy}) => {
                    expect(cache.getUsedItem(1)).to.deep.eq({
                        _type: "site",
                    });
                    expect(proxy.hasChildren).to.equal(true);
                    expect(cache.getUsedItem(1)).to.deep.eq({
                        _type: "site",
                        hasChildren: true,
                    });
                });
        });

        it("should return false for pages without children", () => {
            return cache.loadEntity(121)
                .then(({proxy}) => {
                    expect(cache.getUsedItem(121)).to.deep.eq({
                        _type: "page",
                    });
                    expect(proxy.hasChildren).to.equal(false);
                    expect(cache.getUsedItem(121)).to.deep.eq({
                        _type: "page",
                        hasChildren: false,
                    });
                })
        });
    });

    describe("url", () => {
        it("should throw exception on first call", () => {
            initRequestContext("http://bad-host");
            return cache.loadEntity(12)
                .then(({proxy}) => {
                    expect(() => proxy.url).to.throw("Missing computed: page->url");
                });
        });

        it("should provide url data after exception resolving", () => {
            initRequestContext("http://bad-host");
            return cache.loadEntities([1, 12])
                .then(() => cache.loadEntity(12))
                .then(({proxy}) => {
                    try {
                        proxy.url;
                        expect(false).to.be.true;
                    } catch (ex) {
                        return (ex as ServerDataError).loadData(cache)
                            .then(() => {
                                expect(cache.getUsedItem(12)).to.deep.eq({
                                    _type: "page",
                                    url: {
                                        _type: "site_tree_parent_url",
                                    }
                                });

                                expect(proxy.url.segments).to.be.an("array");
                                expect(cache.getUsedItem(12).url).to.deep.eq({
                                    _type: "site_tree_parent_url",
                                    segments: [{
                                        _type: "site_tree_parent_url_segment",
                                    }, {
                                        _type: "site_tree_parent_url_segment",
                                    }]
                                });

                                expect(proxy.url.segments[0].node._id).to.equal(1);
                                expect(cache.getUsedItem(12).url).to.deep.eq({
                                    _type: "site_tree_parent_url",
                                    segments: [{
                                        _type: "site_tree_parent_url_segment",
                                        node: 1,
                                    }, {
                                        _type: "site_tree_parent_url_segment",
                                    }]
                                });
                            });
                    }
                });
        });
    });
});
