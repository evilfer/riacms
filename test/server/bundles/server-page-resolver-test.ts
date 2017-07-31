/* tslint:disable */
import {expect} from "chai";
import {SiteTypesBundle} from "../../../src/common/bundles/site-types/site-types-bundle";
import {TypeManager} from "../../../src/common/types/type-manager";
import {TypeManagerBuilder} from "../../../src/common/types/type-manager-builder";
import {ServerContext} from "../../../src/server/app/server-context";
import {
    ServerPageResolverBundle,
    ServerPageResolverBundleStores,
} from "../../../src/server/bundles/page-resolver/server-page-resolver-bundle";
import {createFixtureServerContext} from "../utils/fixture-server-context";
import {fixtures} from "./site-fixtures";
import {RenderingCache} from "../../../src/server/orm/cache";
import {ServerRequestContext} from "../../../src/server/bundles/server-bundle";
import {ResolvedPageData} from "../../../src/common/bundles/page-resolver/resolved-page-data";

describe("server page resolver bundle", () => {
    let context: ServerContext;
    let bundle: ServerPageResolverBundle;
    let cache: RenderingCache;

    beforeEach(() => {
        const typesBundle: SiteTypesBundle = new SiteTypesBundle();
        bundle = new ServerPageResolverBundle();

        const builder: TypeManagerBuilder = new TypeManagerBuilder();
        typesBundle.applyTypes(builder);
        const types: TypeManager = builder.build();
        context = createFixtureServerContext([bundle], types, fixtures);
        bundle.setServerContext(context);
        cache = new RenderingCache(types, context.db, 0);
    });


    describe('dataService', () => {
        it('should resolve home page by host name/port', () => {
            const requestContext: ServerRequestContext = {
                cache,
                dataService: name => context.dataService(name, requestContext),
                level: 0,
                req: {url: "http://host1:1000"},
            };

            return context.dataService("resolvedPage", requestContext).then((data: ResolvedPageData) => {
                expect(data).to.have.keys(["admin", "level", "loading", "site", "page", "route", "found", "ssl"]);
                expect(data.found).to.equal(true);
                expect(data.site.entity.id).to.equal(1);
                expect(data.page.entity.id).to.equal(11);
                expect(data.admin).to.be.false;
                expect(data.level).to.equal(0);
            });
        });

        it('should resolve home page by host name/port in admin mode', () => {
            const requestContext: ServerRequestContext = {
                cache,
                dataService: name => context.dataService(name, requestContext),
                level: 0,
                req: {url: "http://host1:1000/_admin"},
            };

            return context.dataService("resolvedPage", requestContext).then((data: ResolvedPageData) => {
                expect(data).to.have.keys(["admin", "level", "loading", "site", "page", "route", "found", "ssl"]);
                expect(data.found).to.equal(true);
                expect(data.site.entity.id).to.equal(1);
                expect(data.page.entity.id).to.equal(11);
                expect(data.admin).to.be.true;
                expect(data.level).to.equal(0);
            });
        });

        it('should resolve level 1 page', () => {
            const requestContext: ServerRequestContext = {
                cache,
                dataService: name => context.dataService(name, requestContext),
                level: 0,
                req: {url: "http://host1:1000/about"},
            };

            return context.dataService("resolvedPage", requestContext).then((store: ResolvedPageData) => {
                expect(store.found).to.equal(true);
                expect(store.site.entity.id).to.equal(1);
                expect(store.page.entity.id).to.equal(12);
            });
        });

        it('should ignore _staging suffix', () => {
            const requestContext: ServerRequestContext = {
                cache,
                dataService: name => context.dataService(name, requestContext),
                level: 0,
                req: {url: "http://host1:1000/about/_staging"},
            };

            return context.dataService("resolvedPage", requestContext).then((store: ResolvedPageData) => {
                expect(store.found).to.equal(true);
                expect(store.site.entity.id).to.equal(1);
                expect(store.page.entity.id).to.equal(12);
            });
        });

        it('should resolve level 2 page', () => {
            const requestContext: ServerRequestContext = {
                cache,
                dataService: name => context.dataService(name, requestContext),
                level: 0,
                req: {url: "http://host1:1000/about/ria"},
            };

            return context.dataService("resolvedPage", requestContext).then((store: ResolvedPageData) => {
                expect(store.found).to.equal(true);
                expect(store.site.entity.id).to.equal(1);
                expect(store.page.entity.id).to.equal(121);
            });
        });

        it('should return not found page for bad route', () => {
            const requestContext: ServerRequestContext = {
                cache,
                dataService: name => context.dataService(name, requestContext),
                level: 0,
                req: {url: "http://host1:1000/about/ria_"},
            };

            return context.dataService("resolvedPage", requestContext).then((store: ResolvedPageData) => {
                expect(store.found).to.equal(false);
                expect(store.site.entity.id).to.equal(1);
                expect(store.page.entity.id).to.equal(13);
                expect(store.route.map(({entity}) => entity.id)).to.deep.eq([12]);
            });
        });
    });

    describe('store', () => {
        it("should define resolvedPage store", () => {
            const declaredStores = bundle.declareRenderingStores();
            expect(declaredStores).not.to.be.null;

            if (declaredStores !== null) {
                expect(declaredStores.resolvedPage).to.be.a("function");
            }
        });

        it('should resolve home page by host name/port', () => {
            const declaredStores = bundle.declareRenderingStores() as ServerPageResolverBundleStores;

            const requestContext: ServerRequestContext = {
                cache,
                dataService: name => context.dataService(name, requestContext),
                level: 0,
                req: {url: "http://host1:1000"},
            };

            return declaredStores.resolvedPage(requestContext).then((store: ResolvedPageData) => {
                expect(store.found).to.equal(true);
                expect(store.site._id).to.equal(1);
                expect(store.page._id).to.equal(11);
            });
        });

        it('should resolve level 1 page', () => {
            const declaredStores = bundle.declareRenderingStores() as ServerPageResolverBundleStores;

            const requestContext: ServerRequestContext = {
                cache,
                dataService: name => context.dataService(name, requestContext),
                level: 0,
                req: {url: "http://host1:1000/about"},
            };

            return declaredStores.resolvedPage(requestContext).then((store: ResolvedPageData) => {
                expect(store.found).to.equal(true);
                expect(store.site._id).to.equal(1);
                expect(store.page._id).to.equal(12);
            });
        });

        it('should resolve level 2 page', () => {
            const declaredStores = bundle.declareRenderingStores() as ServerPageResolverBundleStores;

            const requestContext: ServerRequestContext = {
                cache,
                dataService: name => context.dataService(name, requestContext),
                level: 0,
                req: {url: "http://host1:1000/about/ria"},
            };

            return declaredStores.resolvedPage(requestContext).then((store: ResolvedPageData) => {
                expect(store.found).to.equal(true);
                expect(store.site._id).to.equal(1);
                expect(store.page._id).to.equal(121);
            });
        });

        it('should return not found page for bad route', () => {
            const declaredStores = bundle.declareRenderingStores() as ServerPageResolverBundleStores;

            const requestContext: ServerRequestContext = {
                cache,
                dataService: name => context.dataService(name, requestContext),
                level: 0,
                req: {url: "http://host1:1000/about/ria_"},
            };

            return declaredStores.resolvedPage(requestContext).then((store: ResolvedPageData) => {
                expect(store.found).to.equal(false);
                expect(store.site._id).to.equal(1);
                expect(store.page._id).to.equal(13);
                expect(store.route.map(({_id}) => _id)).to.deep.eq([12]);
            });
        });
    });
});
