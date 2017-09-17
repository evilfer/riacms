/* tslint:disable */
import {expect, use} from "chai";
import {SinonSpy, spy} from "sinon";
import * as sinonChai from "sinon-chai";
import {RenderingCache} from "../../../src/server/orm/server-cache";
import {cacheGenerator} from "../utils/fixture-rendering-cache";
import {computedFunctions, createTypes, fixtures} from "./fixtures";
import {CacheMissingComputedField} from "../../../src/server/orm/cache-missing-computed-field";

use(sinonChai);

describe("cache literal data", () => {

    const loadTest = (level: number, ids: number[], test: (proxies: any[], used: any[]) => void) => {
        return () => {
            const cache: RenderingCache = cacheGenerator(createTypes(), fixtures)(level);
            return cache.loadEntities(ids).then(() => {
                return test(cache.getProxies(ids), cache.getUsed(ids));
            });
        }
    };

    beforeEach(() => {
        spy(computedFunctions, "syncFunc");
        spy(computedFunctions, "asyncFunc");
    });

    afterEach(() => {
        (computedFunctions.syncFunc as SinonSpy).restore();
        (computedFunctions.asyncFunc as SinonSpy).restore();
    });

    describe("sync functions", () => {
        it("should compute simple sync field", loadTest(0, [9], ([proxy]) => {
            expect(proxy.syncField).to.equal("hi name");
            expect(computedFunctions.syncFunc).to.have.been.calledOnce;
        }));

        it("should store computed value", loadTest(0, [9], ([proxy], [used]) => {
            expect(proxy.syncField).to.equal("hi name");
            expect(used.syncField).to.equal("hi name");
        }));

        it("should not invoke function again", loadTest(0, [9], ([proxy]) => {
            expect(proxy.syncField).to.equal("hi name");
            expect(proxy.syncField).to.equal("hi name");
            expect(computedFunctions.syncFunc).to.have.been.calledOnce;
        }));
    });

    describe("async functions", () => {
        it("should throw exception on first call", loadTest(0, [9], ([proxy]) => {
            expect(() => proxy.asyncField).to.throw("Missing computed: computed->asyncField");
        }));

        it("should return data after resolving promise", loadTest(0, [9], ([proxy]) => {
            try {
                proxy.asyncField;
                expect(true).to.equal(false);
            } catch (e) {
                expect(e).to.be.instanceof(CacheMissingComputedField);
                return (e as CacheMissingComputedField).promise.then(() => {
                    expect(() => proxy.asyncField).not.throw();
                    expect(proxy.asyncField).to.equal("hi name");
                });
            }
        }));

        it("should add data to used data", loadTest(0, [9], ([proxy], [used]) => {
            try {
                proxy.asyncField;
            } catch (e) {
                return (e as CacheMissingComputedField).promise.then(() => {
                    expect(used.asyncField).to.equal("hi name");
                });
            }
        }));
    });
});
