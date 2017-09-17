import * as Promise from "bluebird";
import {expect} from "chai";
import {Entity} from "../../src/server/entity/entity";
import {PgJsonDb} from "../src/pgjson-db";
import {fixtures} from "./fixtures";
import {initDb} from "./init-db";

describe("pg json db", () => {
    let db: PgJsonDb;

    beforeEach(() => {
        return initDb()
            .then(newDb => db = newDb);
    });

    describe("write functions", () => {
        it("should create entity", () => {
            return db.transaction("create", 0)
                .then(transaction => {
                    return transaction.createEntity("t1", [{a: 1}])
                        .then(entity => {
                            return transaction.commit().then(() => {
                                expect(entity.id).to.be.a("number");
                                expect(entity.data).to.deep.eq([{a: 1}]);
                            });
                        });
                });
        });

        it("should updatePromise entity", () => {
            return db.transaction("create", 0)
                .then(transaction => {
                    return transaction.createEntity("t1", [{a: 1}])
                        .then(entity1 => transaction.updateEntity(entity1.id, [{a: 2}])
                            .then(entity2 => transaction.commit().then(() => {
                                expect(entity2.id).to.equal(entity1.id);
                                expect(entity2.data).to.deep.eq([{a: 2}]);
                            })));
                });
        });
    });

    describe("read functions", () => {
        let ids: number[];
        const check: (entities: Entity[], expected: number[]) => void = (entities, expected) => {
            expect(entities.map(({id}) => id)).to.deep.eq(expected.map(i => ids[i]));
        };

        beforeEach(() => {
            ids = [];
            return Promise.each(fixtures, fixture => db.transaction("create", 0)
                .then(transaction => transaction.createEntity(fixture.type, fixture.data)
                    .then(entity => {
                        ids.push(entity.id);
                        return transaction.commit();
                    })));
        });

        it("should find entity by id", () => {
            return db.load(ids[0])
                .then(entity => {
                    expect(entity.id).to.equal(ids[0]);
                    expect(entity.type).to.equal("t1");
                });
        });

        it("should find entity by type", () => {
            return db.find(0)
                .implementsType("t1")
                .run()
                .then(entities => {
                    check(entities, [0, 1, 2, 3, 4]);
                });
        });

        it("should find entity by content value", () => {
            const matchingFixtureIds = ids.filter((id, i) => fixtures[i].data[0].a === 1);

            return db.find(0)
                .valueEquals("t1", "a", 1)
                .run()
                .then(entities => {
                    check(entities, [0, 5]);
                });
        });

        it("should ignore level 1 fields when requesting level 0", () => {
            return db.find(0)
                .valueEquals("t1", "a", 10)
                .run()
                .then(entities => {
                    check(entities, []);
                });
        });

        it("should use level 1 fields when requested", () => {
            return db.find(1)
                .valueEquals("t1", "a", 10)
                .run()
                .then(entities => {
                    check(entities, [0]);
                });
        });

        it("should use level 0 fields when higher level requested but not present", () => {
            return db.find(1)
                .valueEquals("t1", "a", 3)
                .run()
                .then(entities => {
                    check(entities, [1, 2, 7]);
                });
        });

        it("should filter numbers by array", () => {
            return db.find(1)
                .valueIn("t1", "a", [1, 2])
                .run()
                .then(entities => {
                    check(entities, [0, 1, 5, 6]);
                });
        });

        it("should filter strings", () => {
            return db.find(1)
                .valueEquals("t1", "b", "a")
                .run()
                .then(entities => {
                    check(entities, [0, 5]);
                });
        });

        it("should filter string when numeric value", () => {
            return db.find(1)
                .valueEquals("t1", "b", "9")
                .run()
                .then(entities => {
                    check(entities, [7]);
                });
        });

        it("should filter strings by array", () => {
            return db.find(1)
                .valueIn("t1", "b", ["a", "b"])
                .run()
                .then(entities => {
                    check(entities, [0, 1, 5, 6]);
                });
        });

        it("should filter string by array when numeric value", () => {
            return db.find(1)
                .valueIn("t1", "b", ["9", "10"])
                .run()
                .then(entities => {
                    check(entities, [7, 8]);
                });
        });

        it("should filter number[]", () => {
            return db.find(1)
                .arrayContains("t1", "as", 1)
                .run()
                .then(entities => {
                    check(entities, [1, 2, 3]);
                });
        });

        it("should filter number[] by array", () => {
            return db.find(1)
                .arrayContainsAny("t1", "as", [0, 4])
                .run()
                .then(entities => {
                    check(entities, [0, 1, 4]);
                });
        });

        it("should filter string[], level 0 (1)", () => {
            return db.find(0)
                .arrayContains("t1", "bs", "b")
                .run()
                .then(entities => {
                    check(entities, [0, 2]);
                });
        });

        it("should filter string[] by array", () => {
            return db.find(1)
                .arrayContainsAny("t1", "bs", ["c", "d"])
                .run()
                .then(entities => {
                    check(entities, [0, 2]);
                });
        });
    });
});
