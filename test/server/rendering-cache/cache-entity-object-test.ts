import {expect} from "chai";
import {RenderingCache} from "../../../src/server/orm/server-cache";
import {cacheGenerator} from "../utils/fixture-rendering-cache";
import {fixtures, types} from "./fixtures";

describe("cache nested data", () => {

    const newFixtureCache = cacheGenerator(types, fixtures);

    const loadTest = (level: number, ids: number[], test: (proxies: any[], used: any[]) => void) => {
        const cache: RenderingCache = newFixtureCache(level);
        return () => cache.loadEntities(ids).then(() => {
            test(cache.getProxies(ids), cache.getUsedItems(ids));
        });
    };

    describe("single object", () => {
        it("should return null for a nested object", loadTest(0, [5], ([proxy5], [used5]) => {
            expect(proxy5.nested).to.equal(null);
            expect(used5.nested).to.equal(null);
        }));

        it("should return proxy for a nested object", loadTest(0, [6], ([proxy6], [used6]) => {
            expect(proxy6.nested).to.be.an("object");
            expect(used6).to.deep.eq({_type: "nestedPage", nested: {_type: "nestedNumber"}});
        }));

        it("should return functional proxy for a nested object", loadTest(0, [6], ([proxy6], [used6]) => {
            expect(proxy6.nested.value).to.equal(4);
            expect(used6).to.deep.eq({_type: "nestedPage", nested: {_type: "nestedNumber", value: 4}});
        }));
    });

    describe("multiple object", () => {
        it("should return [] for undefined values", loadTest(0, [7], ([proxy7], [used7]) => {
            expect(proxy7.nested).to.deep.eq([]);
            expect(used7.nested).to.deep.eq([]);
        }));

        it("should return [{}] for existing list", loadTest(0, [8], ([proxy8], [used8]) => {
            expect(proxy8.nested).to.deep.eq([{_type: "nestedNumber"}, {_type: "nestedNumber"}]);
            expect(used8.nested).to.deep.eq([{_type: "nestedNumber"}, {_type: "nestedNumber"}]);
        }));

        it("should use values of nested list", loadTest(0, [8], ([proxy8], [used8]) => {
            expect(proxy8.nested).to.deep.eq([{_type: "nestedNumber"}, {_type: "nestedNumber"}]);

            expect(proxy8.nested[0].value).to.deep.eq(1);
            expect(used8.nested).to.deep.eq([{_type: "nestedNumber", value: 1}, {_type: "nestedNumber"}]);

            expect(proxy8.nested[1].value).to.deep.eq(2);
            expect(used8.nested).to.deep.eq([{_type: "nestedNumber", value: 1}, {_type: "nestedNumber", value: 2}]);
        }));
    });
});
