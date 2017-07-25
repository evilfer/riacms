import {expect} from "chai";
import {RenderingCache} from "../../../src/server/orm/cache";
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
        expect(used1).to.deep.eq({});
    }));

    it("should add entity prop _id", loadTest([1], ([proxy1], [used1]) => {
        expect(proxy1._id).to.equal(1);
        expect(used1).to.deep.eq({_id: 1});
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
        });
    }));

});
