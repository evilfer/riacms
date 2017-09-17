/* tslint:disable */
import {expect, use} from "chai";
import {SinonSpy, spy} from "sinon";
import * as sinonChai from "sinon-chai";
import {CachedTransaction} from "../../../src/server/orm/cached-transaction/cached-transaction";
import {EntityDb, EntityDbWriteTransaction} from "../../../src/server/orm/entity-db";
import {createFixtureDb} from "../utils/fixture-db";
import {fixtures, types} from "./fixtures";

use(sinonChai);

describe("cached transaction", () => {
    let db: EntityDb;
    let cachedTransaction: CachedTransaction;
    let dbTransaction: EntityDbWriteTransaction;

    beforeEach(() => {
        db = createFixtureDb(types, fixtures);
        return CachedTransaction.open(types, db, "test", 0).then(trx => {
            cachedTransaction = trx;
            dbTransaction = trx.getDbTransaction();

            spy(dbTransaction, "commit");
            spy(dbTransaction, "updateEntity");
            spy(dbTransaction, "createEntity");
        });
    });

    afterEach(() => {
        (dbTransaction.commit as SinonSpy).restore();
        (dbTransaction.updateEntity as SinonSpy).restore();
        (dbTransaction.createEntity as SinonSpy).restore();
    });

    describe("basic functions", () => {

        it("should invoke db commit", () => {
            return cachedTransaction.commit()
                .then(() => {
                    expect(dbTransaction.commit).to.have.been.calledOnce;
                });
        });

        it("should create entity on db in order to get new id", () => {
            return cachedTransaction.createEntity("simple", [{name: 1}])
                .then(entity => {
                    expect(entity.id).to.equal(fixtures.length + 1);
                });
        });

        it("should not invoke dbTrx updatePromise before commit", () => {
            return cachedTransaction.updateEntity(1, [{name: "page1 v2"}])
                .then(() => {
                    expect(dbTransaction.updateEntity).not.to.have.been.called;
                });
        });

        it("should invoke dbTrx updatePromise only once per entity on commit", () => {
            return cachedTransaction.updateEntity(1, [{name: "page1 v2"}])
                .then(() => cachedTransaction.updateEntity(1, [{name: "page1 v3"}]))
                .then(() => cachedTransaction.commit())
                .then(() => {
                    expect(dbTransaction.updateEntity).to.have.been.calledOnce;
                    expect(dbTransaction.updateEntity).to.have.been.calledWith(1, [{name: "page1 v3"}]);
                });
        });
    });

    describe("many-to-many", () => {
        it("should add relation", () => {
            return cachedTransaction.updateEntity(2, [{r1: [3], r2: [3, 4]}])
                .then(() => cachedTransaction.loadMultiple([3, 4]))
                .then(([e3, e4]) => {
                    expect(e3.data[0].r1).to.deep.eq([4, 2]);
                    expect(e3.data[0].r2).to.deep.eq([2]);
                    expect(e4.data[0].r1).to.deep.eq([2]);
                    expect(e4.data[0].r2).to.deep.eq([3]);
                });
        });

        it("should delete relation", () => {
            return cachedTransaction.updateEntity(3, [{r1: [], r2: []}])
                .then(() => cachedTransaction.load(4))
                .then(e4 => {
                    expect(e4.data[0].r1).to.deep.eq([]);
                    expect(e4.data[0].r2).to.deep.eq([]);
                });
        });
    });

    describe("one-to-many", () => {
        it("should add relation", () => {
            return cachedTransaction.updateEntity(5, [{r1: [], r2: 6}])
                .then(() => cachedTransaction.load(6))
                .then(e6 => {
                    expect(e6.data[0].r1).to.deep.eq([7, 5]);
                });
        });

        it("should remove relation", () => {
            return cachedTransaction.updateEntity(7, [{r1: [], r2: null}])
                .then(() => cachedTransaction.load(6))
                .then(e6 => {
                    expect(e6.data[0].r1).to.deep.eq([]);
                });
        });
    });

    describe("many-to-one", () => {
        it("should add relation", () => {
            return cachedTransaction.updateEntity(5, [{r1: [6], r2: null}])
                .then(() => cachedTransaction.load(6))
                .then(e6 => {
                    expect(e6.data[0].r1).to.deep.eq([7]);
                    expect(e6.data[0].r2).to.equal(5);
                });
        });

        it("should remove relation", () => {
            return cachedTransaction.updateEntity(6, [{r1: [], r2: null}])
                .then(() => cachedTransaction.load(7))
                .then(e7 => {
                    expect(e7.data[0].r1).to.deep.eq([]);
                    expect(e7.data[0].r2).to.equal(null);
                });
        });

        it("should replace relation", () => {
            return cachedTransaction.updateEntity(5, [{r1: [7], r2: null}])
                .then(() => cachedTransaction.loadMultiple([6, 7]))
                .then(([e6, e7]) => {
                    expect(e7.data[0].r1).to.deep.eq([]);
                    expect(e7.data[0].r2).to.equal(5);
                    expect(e6.data[0].r1).to.deep.eq([]);
                    expect(e6.data[0].r2).to.equal(null);
                });
        });
    });

    describe("one-to-one", () => {
        it("should add relation", () => {
            return cachedTransaction.updateEntity(8, [{r1: null, r2: 10}])
                .then(() => cachedTransaction.load(10))
                .then(e10 => {
                    expect(e10.data[0].r1).to.equal(8);
                    expect(e10.data[0].r2).to.equal(9);
                });
        });

        it("should remove relation", () => {
            return cachedTransaction.updateEntity(9, [{r1: null, r2: null}])
                .then(() => cachedTransaction.load(10))
                .then(e10 => {
                    expect(e10.data[0].r1).to.equal(null);
                    expect(e10.data[0].r2).to.equal(null);
                });
        });

        it("should replace relation", () => {
            return cachedTransaction.updateEntity(8, [{r1: null, r2: 9}])
                .then(() => cachedTransaction.loadMultiple([9, 10]))
                .then(([e9, e10]) => {
                    expect(e9.data[0].r1).to.equal(8);
                    expect(e9.data[0].r2).to.equal(null);
                    expect(e10.data[0].r1).to.equal(null);
                    expect(e10.data[0].r2).to.equal(null);
                });
        });
    });
});
