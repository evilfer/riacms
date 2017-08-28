/* tslint:disable */
import {expect, use} from "chai";
import * as sinonChai from "sinon-chai";
import {ClientErrorManager} from "../../../../src/client/app/client-error-manager";
import {ClientCache} from "../../../../src/client/cache/client-cache";
import {fixtures, types} from "../../cache/fixtures";
import {ClientResolvedPageStore} from "../../../../src/client/bundles/page-resolver/resolved-page-store";
import {ClientRequestLocationStore} from "../../../../src/client/bundles/request-location/request-location-store";
import {DummyHistory} from "../request-location/dummy-history";

use(sinonChai);

describe("client page resolver store", () => {
    let store: ClientResolvedPageStore;
    let history: DummyHistory;
    let requestLocation: ClientRequestLocationStore;
    let cache: ClientCache;
    let errors: ClientErrorManager;

    beforeEach(() => {
        cache = new ClientCache(types);
        errors = new ClientErrorManager();

        history = new DummyHistory();
        history.init("http", "hn", "1234", "/a/b", "?a=1");

        requestLocation = new ClientRequestLocationStore(history);
        store = new ClientResolvedPageStore(cache, requestLocation);

        cache.loadEntities(fixtures);

        store.loadStoreData({found: true, site: 1, page: 3, path: "a/b", route: [2, 3]})
    });

    afterEach(() => {
    });

    it("should not be loading initially", () => {
        expect(store.loading).to.be.false;
    });

    it("should have loaded initial data", () => {
        const found = store.found;
        const site = store.site;
        const page = store.page;
        const route = store.route;

        expect(store.getError()).to.be.null;

        expect(found).to.be.true;

        expect(site).not.to.be.null;
        expect(site).to.be.an("object");
        if (site !== null) {
            expect(site._id).to.equal(1);
        }

        expect(page).not.to.be.null;
        expect(page).to.be.an("object");
        if (page !== null) {
            expect(page._id).to.equal(3);
        }

        expect(route).not.to.be.null;
        expect(route).to.have.length(2);
        expect(route.map((e: any) => e._id)).to.deep.eq([2, 3]);
    });

    it("should provide data from request location", () => {
        expect(store.ssl).to.equal(false);
        expect(store.admin).to.equal(false);
        expect(store.level).to.equal(0);
    });

    describe("after moving to new page", () => {
        beforeEach(() => {
            history.goto("/c");
        });

        it("should mark loading as true", () => {
            expect(store.loading).to.equal(true);
            expect(store.getError()).to.be.an("error");
        });

        it("should keep old page while loading", () => {
            expect(store.page).not.to.be.null;
            if (store.page !== null) {
                expect(store.page._id).to.equal(3);
            }
        });

        it("should ignore old data responses", () => {
            store.loadStoreData({
                found: false,
                path: "other",
                site: 0,
                page: 0,
                route: []
            });

            expect(store.loading).to.equal(true);
            expect(store.page).not.to.be.null;
            if (store.page !== null) {
                expect(store.page._id).to.equal(3);
            }
        });

        it("should update entities after loading required data", () => {
            store.loadStoreData({
                found: true,
                path: "c",
                site: 4,
                page: 5,
                route: [5]
            });

            expect(store.loading).to.equal(false);
            expect(store.page).not.to.be.null;
            if (store.page !== null) {
                expect(store.page._id).to.equal(5);
            }
        });
    });
});
