/* tslint:disable */

import {expect} from "chai";
import {SiteTypesBundle} from "../../../src/common/bundles/site-types/site-types-bundle";
import {TypeManager} from "../../../src/common/types/type-manager";
import {TypeManagerBuilder} from "../../../src/common/types/type-manager-builder";
import {ServerContext} from "../../../src/server/app/server-context";
import {
    ResolvedPageData,
    ServerPageResolverBundle,
    ServerPageResolverBundleStores
} from "../../../src/server/bundles/page-resolver/server-page-resolver-bundle";
import {createFixtureServerContext} from "../utils/fixture-server-context";
import {fixtures} from "./site-fixtures";
import {RenderingCache} from "../../../src/server/orm/cache";

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

    it("should define resolvedPage store", () => {
        const declaredStores = bundle.declareRenderingStores();
        expect(declaredStores).not.to.be.null;

        if (declaredStores !== null) {
            expect(declaredStores.resolvedPage).to.be.a("function");
        }
    });

    it('should resolve home page by host name/port', () => {
        const declaredStores = bundle.declareRenderingStores() as ServerPageResolverBundleStores;

        return declaredStores.resolvedPage({
            cache,
            level: 0,
            req: {url: "http://host1:1000"}
        }).then((store: ResolvedPageData) => {
            expect(store).to.have.keys(["site", "page", "route", "found"]);
            expect(store.found).to.equal(true);
            expect(store.site._id).to.equal(1);
            expect(store.page._id).to.equal(11);
        });
    });

    it('should resolve level 1 page', () => {
        const declaredStores = bundle.declareRenderingStores() as ServerPageResolverBundleStores;

        return declaredStores.resolvedPage({
            cache,
            level: 0,
            req: {url: "http://host1:1000/about"}
        }).then((store: ResolvedPageData) => {
            expect(store).to.have.keys(["site", "page", "route", "found"]);
            expect(store.found).to.equal(true);
            expect(store.site._id).to.equal(1);
            expect(store.page._id).to.equal(12);
        });
    });

    it('should resolve level 2 page', () => {
        const declaredStores = bundle.declareRenderingStores() as ServerPageResolverBundleStores;

        return declaredStores.resolvedPage({
            cache,
            level: 0,
            req: {url: "http://host1:1000/about/ria"}
        }).then((store: ResolvedPageData) => {
            expect(store).to.have.keys(["site", "page", "route", "found"]);
            expect(store.found).to.equal(true);
            expect(store.site._id).to.equal(1);
            expect(store.page._id).to.equal(121);
        });
    });

    it('should return not found page for bad route', () => {
        const declaredStores = bundle.declareRenderingStores() as ServerPageResolverBundleStores;

        return declaredStores.resolvedPage({
            cache,
            level: 0,
            req: {url: "http://host1:1000/about/ria_"}
        }).then((store: ResolvedPageData) => {
            expect(store).to.have.keys(["site", "page", "route", "found"]);
            expect(store.found).to.equal(false);
            expect(store.site._id).to.equal(1);
            expect(store.page._id).to.equal(13);
            expect(store.route.map(({_id}) => _id)).to.deep.eq([12]);
        });
    });

});
