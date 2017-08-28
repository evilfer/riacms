/* tslint:disable */
import {expect, use} from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";
import {ClientErrorManager} from "../../../../src/client/app/client-error-manager";
import {ClientCache} from "../../../../src/client/cache/client-cache";
import {fixtures, types} from "../../cache/fixtures";
import {ClientEntityFinderBundle} from "../../../../src/client/bundles/entity-finder/client-entity-finder-bundle";
import {ClientBundleGroup} from "../../../../src/client/bundles/client-bundle-group";
import {SinonSpy} from "sinon";

use(sinonChai);

describe("client entity finder bundle", () => {
    let bundle: ClientEntityFinderBundle;
    let bundles: ClientBundleGroup;
    let cache: ClientCache;
    let errors: ClientErrorManager;

    beforeEach(() => {
        cache = new ClientCache(types);
        errors = new ClientErrorManager();
        bundle = new ClientEntityFinderBundle();

        bundle.setClientContext({
            bundles,
            cache,
            errors,
            types,
        });

        bundles = new ClientBundleGroup([bundle]);


        cache.loadEntities(fixtures);

        sinon.spy(errors, "registerErrorReporter");
    });

    afterEach(() => {
        (errors.registerErrorReporter as SinonSpy).restore();
    });

    it("should create store", () => {
        const stores = bundle.createStores();
        expect(stores).to.have.keys(["entityFinder"])
    });

    it("should register error reporter", () => {
        bundle.createStores();
        expect(errors.registerErrorReporter).to.have.been.calledOnce;
    });

    it("should connect error reporting to store", () => {
        const {entityFinder} = bundle.createStores() as any;
        entityFinder.find("name", {_type: "t"});
        const errList = errors.getErrorsAndReset();
        expect(errList).to.have.length(1);
    });

});
