/* tslint:disable */
import {expect} from "chai";
import {ClientCache} from "../../../src/client/cache/client-cache";
import {fixtures, types} from "./fixtures";

describe("client entity cache", () => {

    let cache: ClientCache;

    beforeEach(() => {
        cache = new ClientCache(types);
    });

    it("should return null for non existing entity", () => {
        const entity = cache.getEntity(1);
        expect(entity).to.be.null;
    });

    it("should return null for non existing entity", () => {
        const entity = cache.getEntity(1);
        expect(entity).to.be.null;
    });

    it("should keep track of missing entities", () => {
        cache.getEntity(1);
        expect(cache.getMissing().missing).to.be.true;
        expect(cache.getMissing().entities).to.deep.eq([1]);
    });

    it("should return empty for non existing entity in list", () => {
        const entity = cache.getEntities([1]);
        expect(entity).to.deep.eq([]);
        expect(cache.getMissing().missing).to.be.true;
        expect(cache.getMissing().entities).to.deep.eq([1]);
    });

    describe("with loaded data", () => {
        beforeEach(() => {
            cache.loadEntities(fixtures);
        });

        it("should provide entities", () => {
            expect(cache.getEntity(1)).to.be.an("object");
            expect(cache.getMissing().missing).to.be.false;
        });

        it("entities should have _id", () => {
            const entity: any = cache.getEntity(1);
            expect(entity).to.be.an("object");

            if (entity !== null) {
                expect(entity._id).to.equal(1);
                expect(cache.getMissing().missing).to.be.false;
            }
        });

        it("should provide entities with literal data", () => {
            const entity: any = cache.getEntity(2);
            if (entity !== null) {
                expect(entity.name).to.equal("page2");
                expect(entity.subtitle).to.equal("st2");
            }
            expect(cache.getMissing().missing).to.be.false;
        });

        it("missing literal fields should return null", () => {
            const entity: any = cache.getEntity(21);
            if (entity !== null) {
                expect(entity.name).to.equal(undefined);
            }
            expect(cache.getMissing()).to.deep.eq({
                missing: true,
                entities: [],
                data: {21: ["name"]},
            });
        });

        it("should provide entities with related data", () => {
            const entity3: any = cache.getEntity(3);
            const entity1 = entity3.related;
            expect(entity1).to.be.an("object");
            expect(entity1._id).to.equal(1);
            expect(cache.getMissing().missing).to.be.false;
        });

        it("should provide null with missing related data", () => {
            const entity3: any = cache.getEntity(31);
            const entity100 = entity3.related;
            expect(entity100).to.equal(null);
            expect(cache.getMissing().missing).to.be.true;
            expect(cache.getMissing().entities).to.deep.eq([100]);
        });

        it("should provide entities with related[] data", () => {
            const entity4: any = cache.getEntity(4);
            const related = entity4.relatedMultiple;
            expect(related).to.be.an("array");
            expect(related.map((e: any) => e._id)).to.deep.eq([1, 3]);
            expect(cache.getMissing().missing).to.be.false;
        });

        it("should provide found entities with related[] data", () => {
            const entity4: any = cache.getEntity(41);
            const related = entity4.relatedMultiple;
            expect(related).to.be.an("array");
            expect(related.map((e: any) => e._id)).to.deep.eq([1, 3]);
            expect(cache.getMissing().missing).to.be.true;
            expect(cache.getMissing().entities).to.deep.eq([101, 102]);
        });

        it("should provide undefined for missing related[] data", () => {
            const entity42: any = cache.getEntity(42);
            const related = entity42.relatedMultiple;
            expect(related).to.deep.eq(undefined);
            expect(cache.getMissing()).to.deep.eq({
                missing: true,
                entities: [],
                data: {42: ["relatedMultiple"]}
            });
        });


        it("should provide null nested object data", () => {
            const entity5: any = cache.getEntity(5);
            const nested = entity5.nested;
            expect(nested).to.be.null;
            expect(cache.getMissing().missing).to.be.false;
        });

        it("should provide null with missing nested object data", () => {
            const entity51: any = cache.getEntity(51);
            const nested = entity51.nested;
            expect(nested).to.be.undefined;
            expect(cache.getMissing()).to.deep.eq({
                missing: true,
                entities: [],
                data: {
                    51: ["nested"]
                }
            });
        });

        it("should provide non-null nested object data", () => {
            const entity6: any = cache.getEntity(6);
            const nested = entity6.nested;
            expect(nested).not.to.be.null;
            expect(nested.value).to.equal(4);
            expect(cache.getMissing().missing).to.be.false;
        });

        it("should provide record missing value in nested object data", () => {
            const entity61: any = cache.getEntity(61);
            const nested = entity61.nested;
            expect(nested).not.to.be.null;
            expect(cache.getMissing().missing).to.be.false;
            expect(nested.value).to.equal(undefined);
            expect(cache.getMissing()).to.deep.eq({
                missing: true,
                entities: [],
                data: {
                    61: ["nested.value"]
                }
            });
        });

        it("should provide array with nested[] data", () => {
            const entity7: any = cache.getEntity(7);
            const nested = entity7.nested;
            expect(nested).to.be.an("array");
            expect(nested[0].value).to.equal(1);
            expect(cache.getMissing().missing).to.be.false;
        });

        it("should record missing nested data with nested[] field", () => {
            const entity7: any = cache.getEntity(7);
            const nested = entity7.nested;
            expect(nested).to.be.an("array");
            expect(nested[2].value).to.equal(undefined);
            expect(cache.getMissing()).to.deep.eq({
                missing: true,
                entities: [],
                data: {
                    7: ["nested.2.value"]
                }
            });
        });

        it("should provide empty array with missing nested[] data", () => {
            const entity71: any = cache.getEntity(71);
            const nested = entity71.nested;
            expect(nested).to.deep.eq(undefined);
            expect(cache.getMissing()).to.deep.eq({
                missing: true,
                entities: [],
                data: {71: ["nested"]}
            });
        });
    });
});
