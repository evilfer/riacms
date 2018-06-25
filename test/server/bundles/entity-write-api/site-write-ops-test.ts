import {expect} from "chai";
import {applySiteTypes} from "../../../../src/common/bundles/site-types/site-types";
import {TypeManager} from "../../../../src/common/types/type-manager";
import {TypeManagerBuilder} from "../../../../src/common/types/type-manager-builder";
import {createPage, createSite} from "../../../../src/server/bundles/entity-write-api/site-write-ops";
import {Entity} from "../../../../src/server/entity/entity";
import {createFixtureDb, FixtureDb} from "../../utils/fixture-db";

describe("site write operations", () => {

    let db: FixtureDb;
    let types: TypeManager;

    beforeEach(() => {
        const builder = new TypeManagerBuilder();
        applySiteTypes(builder);

        types = builder.build();
        db = createFixtureDb(types, []);
    });

    it("should create site", () => {
        return createSite(types, db, 0, [{host: "host", port: [80]}])
            .then(site => {
                expect(site.type).to.equal("site");
                expect(site.id).to.be.a("number");
                expect(site.data).to.deep.eq([{host: "host", port: [80]}]);
                expect(db.fixtureMap).has.key(site.id.toString());
            });
    });

    describe("operations on existing site", () => {
        let site: Entity;

        beforeEach(() => {
            return createSite(types, db, 0, [{host: "host", port: [80]}])
                .then(entity => site = entity);
        });

        it("should create page", () => {
            return createPage(types, db, 0, site.id, [{}], "page")
                .then(page => {
                    expect(site.data[0].childLinks).to.have.length(1);
                    expect(page.data[0].parentLinks).to.have.length(1);
                    expect(site.data[0].childLinks).to.deep.eq(page.data[0].parentLinks);
                });
        });
    });
});
