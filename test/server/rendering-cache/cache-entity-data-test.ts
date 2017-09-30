import {expect} from "chai";
import {RenderingCache} from "../../../src/server/orm/server-cache";
import {cacheGenerator} from "../utils/fixture-rendering-cache";
import {fixtures, types} from "./fixtures";

describe("cache literal data", () => {

    const newCache = cacheGenerator(types, fixtures);

    const loadTest = (level: number, ids: number[], test: (proxies: any[], used: any[]) => void) => {
        const cache: RenderingCache = newCache(level);
        return () => cache.loadEntities(ids).then(() => {
            test(cache.getProxies(ids), cache.getUsedItems(ids));
        });
    };

    it("should always have _type", loadTest(0, [1], ([proxy1], [used1]) => {
        expect(used1).to.deep.eq({_type: "page"});
    }));

    it("should never add _id to used data", loadTest(0, [1], ([proxy1], [used1]) => {
        expect(proxy1._id).to.equal(1);
        expect(used1).to.deep.eq({_type: "page"});
    }));

    it("should add entity prop name", loadTest(0, [1], ([proxy1], [used1]) => {
        expect(proxy1.name).to.equal("page1");
        expect(used1).to.deep.eq({_type: "page", name: "page1"});
    }));

    it("should add entity prop, level 1", loadTest(1, [1], ([proxy1], [used1]) => {
        expect(proxy1.name).to.equal("page1_updated");
        expect(used1).to.deep.eq({_type: "page", name: "page1_updated"});
    }));

    it("should use level 0 data if not available in lower levels", loadTest(1, [2], ([proxy2], [used2]) => {
        expect(proxy2.name).to.equal("page2_updated");
        expect(proxy2.subtitle).to.equal("st2");
        expect(used2).to.deep.eq({_type: "extendedPage", name: "page2_updated", subtitle: "st2"});
    }));

    it("should provide map of used assets", () => {
        const cache: RenderingCache = newCache(0);
        return cache.loadEntities([1, 2]).then(() => {
            expect(cache.getClientEntities()).to.deep.eq({1: {_type: "page"}, 2: {_type: "extendedPage"}});
        });
    });

});
