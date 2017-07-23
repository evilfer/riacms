import {TypeManagerBuilder} from "../../types/type-manager-builder";
import {Bundle} from "../bundle";

export class SiteTypesBundle extends Bundle {
    public getName(): string {
        return "siteTypes";
    }

    public applyTypes(typeBuilder: TypeManagerBuilder): void {
        typeBuilder.createAbstractType("site_tree_parent", [{
            inverseField: "parents",
            name: "children",
            relatedType: "page",
            type: "related[]",
        }, {
            computed: true,
            name: "hasChildren",
            type: "boolean",
        }]);

        typeBuilder.createConcreteType("site", [
            {name: "host", type: "string"},
            {name: "home", type: "related", relatedType: "page", inverseField: null},
            {name: "notFound", type: "related", relatedType: "page", inverseField: null},
        ]);
        typeBuilder.typeInherits("site", "site_tree_parent");

        typeBuilder.createConcreteType("page", [
            {name: "parents", type: "related[]", relatedType: "site_tree_parent", inverseField: "children"},
            {name: "paths", type: "string[]"},
        ]);
        typeBuilder.typeInherits("page", "site_tree_parent");
    }
}
