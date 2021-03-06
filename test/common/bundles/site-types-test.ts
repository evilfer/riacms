import {expect} from "chai";
import {applySiteTypes} from "../../../src/common/bundles/site-types/site-types";
import {TypeManager} from "../../../src/common/types/type-manager";
import {TypeManagerBuilder} from "../../../src/common/types/type-manager-builder";

describe("site types", () => {

    it("should create site related types", () => {
        const builder: TypeManagerBuilder = new TypeManagerBuilder();
        applySiteTypes(builder);

        const types: TypeManager = builder.build();

        expect(types.getFields("site_tree_parent")).to.be.an("array");
        expect(types.getFields("page")).to.be.an("array");
        expect(types.getFields("site")).to.be.an("array");
    });
});
