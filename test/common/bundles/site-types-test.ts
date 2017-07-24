import {expect} from "chai";
import {SiteTypesBundle} from "../../../src/common/bundles/site-types/site-types-bundle";
import {TypeManager} from "../../../src/common/types/type-manager";
import {TypeManagerBuilder} from "../../../src/common/types/type-manager-builder";

describe("site types bundle", () => {

    it("should create site related types", () => {
        const builder: TypeManagerBuilder = new TypeManagerBuilder();
        const bundle: SiteTypesBundle = new SiteTypesBundle();

        bundle.applyTypes(builder);

        const types: TypeManager = builder.build();

        expect(types.getFields("site_tree_parent")).to.be.an("array");
        expect(types.getFields("page")).to.be.an("array");
        expect(types.getFields("site")).to.be.an("array");
    });
});
