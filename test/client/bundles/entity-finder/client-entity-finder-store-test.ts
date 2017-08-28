/* tslint:disable */
import {expect, use} from "chai";
import * as sinonChai from "sinon-chai";
import {ClientErrorManager} from "../../../../src/client/app/client-error-manager";
import {ClientEntityFinderStore} from "../../../../src/client/bundles/entity-finder/entity-finder-store";
import {ClientCache} from "../../../../src/client/cache/client-cache";
import {fixtures, types} from "../../cache/fixtures";
import {queryHash} from "../../../../src/common/bundles/entity-finder/entity-finder-data";

use(sinonChai);

describe("client entity finder store", () => {
    let store: ClientEntityFinderStore;
    let cache: ClientCache;
    let errors: ClientErrorManager;

    beforeEach(() => {
        cache = new ClientCache(types);
        errors = new ClientErrorManager();
        store = new ClientEntityFinderStore(cache);

        cache.loadEntities(fixtures);
    });

    afterEach(() => {
    });

    it("should return default data for non-loaded searches", () => {
        const data = store.find("s", {_type: "t"});
        expect(data).to.deep.eq({
            data: [],
            loading: true,
        });
    });

    it("should notify of error on query", () => {
        store.find("s", {_type: "t"});
        expect(store.getError()).to.be.an("error");
    });

    describe("with loaded data", () => {
        const name = "n1";
        const query = {_type: "t"};
        beforeEach(() => {
            const hash = queryHash(query);
            const data = {
                n: {[name]: hash},
                q: {[hash]: [1]},
            };

            store.loadStoreData(data);
        });

        it("should return existing data", () => {
            const result = store.find(name, query);
            expect(store.getError()).to.be.null;
            expect(result.loading).to.be.false;
            expect(result.data).to.have.length(1);
            console.log(result.data);
            console.log(result.data[0]);
            console.log(result.data.length);
            expect(result.data[0]._id).to.equal(1);
        });

        it("should return old data and notify error when not available", () => {
            const result = store.find(name, {_type: "t2"});
            expect(store.getError()).to.be.an("error");
            expect(result.loading).to.be.true;
            expect(result.data).to.have.length(1);
            console.log(result.data);
            console.log(result.data[0]);
            console.log(result.data.length);
            expect(result.data[0]._id).to.equal(1);
        });
    });

});
