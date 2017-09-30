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

    typeBuilder.createAbstractType("site_tree_parent_url_segment", [{
        name: "segment",
        type: "string",
    }, {
        name: "ssl",
        type: "boolean",
    }, {
        inverseField: null,
        name: "node",
        relatedType: "site_tree_parent",
        type: "related",
    }]);

    typeBuilder.createAbstractType("site_tree_parent_url", [{
        name: "segments",
        nestedType: "site_tree_parent_url_segment",
        type: "object[]",
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
    }, {
        computed: true,
        name: "url",
        nestedType: "site_tree_parent_url",
        type: "object",
    }]);

    typeBuilder.createConcreteType("site", [
        {name: "host", type: "string"},
        {name: "port", type: "number[]"},
        {name: "home", type: "related", relatedType: "page", inverseField: "homeOf"},
        {name: "notFound", type: "related", relatedType: "page", inverseField: null},
    ]);
    typeBuilder.typeInherits("site", "site_tree_parent");

    typeBuilder.createConcreteType("page", [
        {name: "parentLinks", type: "related[]", relatedType: "site_tree_link", inverseField: "child"},
        {name: "paths", type: "string[]"},
        {name: "homeOf", type: "related", relatedType: "site", inverseField: "home"},

    ]);
    typeBuilder.typeInherits("page", "site_tree_parent");
}
