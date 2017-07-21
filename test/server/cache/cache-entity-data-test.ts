import {expect} from "chai";
import {RenderingCache} from "../../../src/server/cache/cache";
import {newFixtureCache} from "./fixture-db";

describe("cache literal data", () => {

    const loadTest = (level: number, ids: number[], test: (proxies: any[], used: any[]) => void) => {
        const cache: RenderingCache = newFixtureCache(level);
        return () => cache.loadEntities(ids).then(() => {
            test(cache.getProxies(ids), cache.getUsed(ids));
        });
    };

    it("should add entity prop _id", loadTest(0, [1], ([proxy1], [used1]) => {
        expect(proxy1.name).to.equal("page1");
        expect(used1).to.deep.eq({name: "page1"});
    }));

    it("should add entity prop _id, level 1", loadTest(1, [1], ([proxy1], [used1]) => {
        expect(proxy1.name).to.equal("page1_updated");
        expect(used1).to.deep.eq({name: "page1_updated"});
    }));

    it("should use level 0 data if not available in lower levels", loadTest(1, [2], ([proxy2], [used2]) => {
        expect(proxy2.name).to.equal("page2_updated");
        expect(proxy2.subtitle).to.equal("st2");
        expect(used2).to.deep.eq({name: "page2_updated", subtitle: "st2"});
    }));

});
