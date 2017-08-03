import {TypeManagerBuilder} from "../../../../src/common/types/type-manager-builder";
import {Entity} from "../../../../src/server/entity/entity";

export default function applyTestTypes(builder: TypeManagerBuilder) {
    builder.extendType("page", [
        {type: "related", name: "relatedPage", relatedType: "page", inverseField: null},
    ]);
}

export const fixtures: Entity[] = [
    {
        data: [{
            childLinks: [10011],
            home: 11,
            host: "host1",
            name: "site1",
            notFound: 11,
            port: 1000,
            renderer: "r1",
        }],
        id: 1,
        type: "site",
    },
    {
        data: [{
            childLinks: [20021, 20022],
            home: 21,
            host: "*",
            name: "site2",
            notFound: 22,
            port: null,
            renderer: "r2",
        }],
        id: 2,
        type: "site",
    },
    {
        data: [{
            childLinks: [],
            name: "page11",
            parentLinks: [10011],
            paths: ["home"],
        }],
        id: 11,
        type: "page",
    },
    {
        data: [{
            childLinks: [],
            name: "page21",
            parentLinks: [20021],
            paths: ["home"],
            relatedPage: null,
        }],
        id: 21,
        type: "page",
    },
    {
        data: [{
            childLinks: [],
            name: "page22",
            parentLinks: [20022],
            paths: ["about"],
            relatedPage: 21,
        }],
        id: 22,
        type: "page",
    },
    {
        data: [{
            child: 11,
            parent: 1,
        }],
        id: 10011,
        type: "site_tree_link",
    },
    {
        data: [{
            child: 21,
            parent: 2,
        }],
        id: 20021,
        type: "site_tree_link",
    },
    {
        data: [{
            child: 22,
            parent: 2,
        }],
        id: 20022,
        type: "site_tree_link",
    },
];
