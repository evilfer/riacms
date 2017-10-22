import {expect} from "chai";
import {RenderingCache} from "../../../src/server/orm/server-cache";
import {cacheGenerator} from "../utils/fixture-rendering-cache";
import {fixtures, types} from "./fixtures";

describe("cache related data", () => {

    const newFixtureCache = cacheGenerator(types, fixtures);

    const loadTest = (level: number, ids: number[], test: (proxies: any[], used: any[]) => void) => {
        const cache: RenderingCache = newFixtureCache(level);
        return () => cache.loadEntities(ids).then(() => {
            test(cache.getProxies(ids), cache.getUsedItems(ids));
        });
    };

    describe("single related", () => {
        it("should fail on using unloaded related entity", loadTest(0, [3], ([proxy3]) => {
            expect(() => proxy3.related).to.throw("Missing: [1]");
        }));

        it("should return related if already loaded", loadTest(0, [3, 1], ([proxy3, proxy1], [used3]) => {
            expect(() => proxy3.related).not.to.throw("Missing: [1]");
            expect(proxy3.related).to.equal(proxy1);
            expect(used3).to.deep.eq({_type: "relatedPage", related: 1});
        }));

        it("should provided null as used data if nor defined", loadTest(0, [31], ([proxy31], [used31]) => {
            expect(proxy31.related).to.equal(null);
            expect(used31).to.deep.eq({_type: "relatedPage", related: null});
        }));
    });

    describe("multiple related", () => {
        it("should fail on using unloaded related entity", loadTest(0, [4], ([proxy4]) => {
            expect(() => proxy4.relatedMultiple).to.throw("Missing: [1, 3]");
        }));

        it("should fail on using partial unloaded related entity", loadTest(0, [4, 1], ([proxy4]) => {
            expect(() => proxy4.relatedMultiple).to.throw("Missing: [3]");
        }));

        it("should return related if already loaded", loadTest(0, [4, 3, 1], ([proxy4, proxy3, proxy1], [used4]) => {
            expect(proxy4.relatedMultiple[0]).to.equal(proxy1);
            expect(proxy4.relatedMultiple[1]).to.equal(proxy3);
            expect(used4).to.deep.eq({_type: "relatedMultiplePage", relatedMultiple: [1, 3]});
        }));

        it("should provide [] if not defined", loadTest(0, [41], ([proxy41], [used41]) => {
            expect(proxy41.relatedMultiple).to.deep.eq([]);
            expect(used41).to.deep.eq({_type: "relatedMultiplePage", relatedMultiple: []});
        }));
    });
});
