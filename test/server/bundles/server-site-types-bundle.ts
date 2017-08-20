import {expect} from "chai";
import {TypeManager} from "../../../src/common/types/type-manager";
import {TypeManagerBuilder} from "../../../src/common/types/type-manager-builder";
import {ServerSiteTypesBundle} from "../../../src/server/bundles/site-types/server-site-types-bundle";

describe("server site types bundle", () => {

    it("should create site related types", () => {
        const builder: TypeManagerBuilder = new TypeManagerBuilder();
        const bundle: ServerSiteTypesBundle = new ServerSiteTypesBundle();

        bundle.applyTypes(builder);

        const types: TypeManager = builder.build();

        expect(types.getFields("site_tree_parent")).to.be.an("array");
        expect(types.getFields("page")).to.be.an("array");
        expect(types.getFields("site")).to.be.an("array");
    });
});
