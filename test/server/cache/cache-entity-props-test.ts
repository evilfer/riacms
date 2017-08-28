import {expect} from "chai";
import {RenderingCache} from "../../../src/server/orm/server-cache";
import {cacheGenerator} from "../utils/fixture-rendering-cache";
import {fixtures, types} from "./fixtures";

describe("cache entity props", () => {

    const newFixtureCache = cacheGenerator([], types, fixtures);

    const loadTest = (ids: number[], test: (proxies: any[], used: any[]) => void) => {
        const cache: RenderingCache = newFixtureCache(0);
        return () => cache.loadEntities(ids).then(() => {
            test(cache.getProxies(ids), cache.getUsed(ids));
        });
    };

    it("should create initial empty proxy", loadTest([1], ([proxy1], [used1]) => {
        expect(used1).to.deep.eq({_type: "page"});
    }));

    it("should add entity prop _type", loadTest([1], ([proxy1], [used1]) => {
        expect(proxy1._type).to.equal("page");
        expect(used1).to.deep.eq({_type: "page"});
    }));

    it("should add entity prop _data", loadTest([1], ([proxy1], [used1]) => {
        expect(proxy1._data).to.be.an("array");
        expect(used1).to.deep.eq({
            _data: [
                {name: "page1"},
                {name: "page1_updated"},
            ],
            _type: "page",
        });
    }));

    it("should provide __id without marking it as used", loadTest([1], ([proxy1], [used1]) => {
        expect(proxy1.__id).to.equal(1);
        expect(used1).to.deep.eq({_type: "page"});
    }));

    it("should provide __type without marking it as used", loadTest([1], ([proxy1], [used1]) => {
        expect(proxy1.__type).to.equal("page");
        expect(used1).to.deep.eq({_type: "page"});
    }));

    it("should provide __data without marking it as used", loadTest([1], ([proxy1], [used1]) => {
        expect(proxy1.__data).to.be.an("array");
        expect(used1).to.deep.eq({_type: "page"});
    }));

    it("should provide __content without marking it as used", loadTest([1], ([proxy1], [used1]) => {
        expect(proxy1.__content).to.be.an("object");
        expect(used1).to.deep.eq({_type: "page"});
    }));
});
