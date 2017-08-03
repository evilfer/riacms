import * as Promise from "bluebird";
import {expect} from "chai";
import {PgJsonDb} from "../src/pgjson-db";
import {fixtures} from "./fixtures";
import {initDb} from "./init-db";

describe("db", () => {
    let db: PgJsonDb;

    beforeEach(() => {
        return initDb()
            .then(newDb => db = newDb);
    });

    describe("write functions", () => {
        it("should create entity", () => {
            return db.action("create", 0)
                .then(action => {
                    return action.createEntity("t1", [{a: 1}])
                        .then(entity => {
                            return action.commit().then(() => {
                                expect(entity.id).to.be.a("number");
                                expect(entity.data).to.deep.eq([{a: 1}]);
                            });
                        });
                });
        });

        it("should update entity", () => {
            return db.action("create", 0)
                .then(action => {
                    return action.createEntity("t1", [{a: 1}])
                        .then(entity1 => action.updateEntity(entity1.id, [{a: 2}])
                            .then(entity2 => action.commit().then(() => {
                                expect(entity2.id).to.equal(entity1.id);
                                expect(entity2.data).to.deep.eq([{a: 2}]);
                            })));
                });
        });
    });

    describe("read functions", () => {
        let ids: number[];
        beforeEach(() => {
            ids = [];
            return Promise.each(fixtures, fixture => db.action("create", 0)
                .then(action => action.createEntity(fixture.type, fixture.data)
                    .then(entity => {
                        ids.push(entity.id);
                        return action.commit();
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
            const t1fixtureIds = ids.filter((id, i) => fixtures[i].type === "t1");

            return db.find(0)
                .valueEquals("_type", "t1")
                .run()
                .then(entities => {
                    expect(entities.map(entity => entity.id)).to.deep.eq(t1fixtureIds);
                });
        });

        it("should find entity by content value", () => {
            const matchingfixtureIds = ids.filter((id, i) => fixtures[i].data[0].a === 1);

            return db.find(0)
                .valueEquals("a", 1)
                .run()
                .then(entities => {
                    expect(entities.map(entity => entity.id)).to.deep.eq(matchingfixtureIds);
                });
        });

        it("should ignore level 1 fields when requesting level 0", () => {
            return db.find(0)
                .valueEquals("a", 10)
                .run()
                .then(entities => {
                    expect(entities).to.have.length(0);
                });
        });

        it("should use level 1 fields when requested", () => {
            return db.find(1)
                .valueEquals("a", 10)
                .run()
                .then(entities => {
                    expect(entities).to.have.length(1);
                });
        });

        it("should use level 0 fields when higher level requested but not present", () => {
            return db.find(1)
                .valueEquals("a", 3)
                .run()
                .then(entities => {
                    expect(entities).to.have.length(3);
                });
        });
    });
});
