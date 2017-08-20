import {TypeManagerBuilder} from "../../types/type-manager-builder";

export function applySiteTypes(typeBuilder: TypeManagerBuilder): void {
    typeBuilder.createConcreteType("site_tree_link", [{
        inverseField: "parentLinks",
        name: "child",
        relatedType: "page",
        type: "related",
    }, {
        inverseField: "childLinks",
        name: "parent",
        relatedType: "site_tree_parent",
        type: "related",
    }]);

    typeBuilder.createAbstractType("site_tree_parent", [{
        inverseField: "parent",
        name: "childLinks",
        relatedType: "site_tree_link",
        type: "related[]",
    }, {
        name: "name",
        type: "string",
    }, {
        computed: true,
        name: "hasChildren",
        type: "boolean",
    }]);

    typeBuilder.createConcreteType("site", [
        {name: "host", type: "string"},
        {name: "port", type: "number[]"},
        {name: "home", type: "related", relatedType: "page", inverseField: null},
        {name: "notFound", type: "related", relatedType: "page", inverseField: null},
    ]);
    typeBuilder.typeInherits("site", "site_tree_parent");

    typeBuilder.createConcreteType("page", [
        {name: "parentLinks", type: "related[]", relatedType: "site_tree_link", inverseField: "child"},
        {name: "paths", type: "string[]"},
    ]);
    typeBuilder.typeInherits("page", "site_tree_parent");
}
