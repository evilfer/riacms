/* tslint:disable */
import {expect, use} from "chai";
import * as sinon from "sinon";
import {SinonSpy} from "sinon";
import * as sinonChai from "sinon-chai";
import {ClientErrorManager} from "../../../../src/client/app/client-error-manager";
import {ClientCache} from "../../../../src/client/cache/client-cache";
import {fixtures, types} from "../../cache/fixtures";
import {ClientBundleGroup} from "../../../../src/client/bundles/client-bundle-group";
import {ClientPageResolverBundle} from "../../../../src/client/bundles/page-resolver/client-page-resolver-bundle";
import {ClientRequestLocationBundle} from "../../../../src/client/bundles/request-location/client-request-location-bundle";
import {DummyHistory} from "../request-location/dummy-history";
import {ClientContext} from "../../../../src/client/app/client-context";

use(sinonChai);

describe("client page resolver bundle", () => {
    let requestLocation: ClientRequestLocationBundle;
    let bundle: ClientPageResolverBundle;
    let bundles: ClientBundleGroup;
    let history: DummyHistory;
    let cache: ClientCache;
    let errors: ClientErrorManager;

    beforeEach(() => {
        cache = new ClientCache(types);
        errors = new ClientErrorManager();
        sinon.spy(errors, "registerErrorReporter");

        history = new DummyHistory();
        requestLocation = new ClientRequestLocationBundle(history);
        bundle = new ClientPageResolverBundle();
        bundles = new ClientBundleGroup([requestLocation, bundle]);

        const context: ClientContext = {bundles, cache, errors, types};
        requestLocation.setClientContext(context);
        bundle.setClientContext(context);


        cache.loadEntities(fixtures);
    });

    afterEach(() => {
        (errors.registerErrorReporter as SinonSpy).restore();
    });

    it("should create store", () => {
        const stores = bundles.getStores();
        expect(stores).to.have.keys(["location", "resolvedPage"])
    });

    it("should connect error reporting to store", () => {
        const {resolvedPage} = bundles.getStores() as any;
        history.goto("/a/b");
        resolvedPage.page;
        const errList = errors.getErrorsAndReset();
        expect(errList).to.have.length(1);
    });

    it("should register error reporter", () => {
        bundles.getStores();
        expect(errors.registerErrorReporter).to.have.been.calledOnce;
    });
});
