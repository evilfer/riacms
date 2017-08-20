import {expect} from "chai";
import {ClientSiteTypesBundle} from "../../../src/client/bundles/site-types/client-site-types-bundle";
import {TypeManager} from "../../../src/common/types/type-manager";
import {TypeManagerBuilder} from "../../../src/common/types/type-manager-builder";

describe("client site types bundle", () => {

    it("should create site related types", () => {
        const builder: TypeManagerBuilder = new TypeManagerBuilder();
        const bundle: ClientSiteTypesBundle = new ClientSiteTypesBundle();

        bundle.applyTypes(builder);

        const types: TypeManager = builder.build();

        expect(types.getFields("site_tree_parent")).to.be.an("array");
        expect(types.getFields("page")).to.be.an("array");
        expect(types.getFields("site")).to.be.an("array");
    });
});
