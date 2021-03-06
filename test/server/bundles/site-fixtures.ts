import {TypeManager} from "../../../src/common/types/type-manager";
import {ServerSiteTypesBundle} from "../../../src/server/bundles/site-types/server-site-types-bundle";
import {Entity} from "../../../src/server/entity/entity";
import {ServerTypeManagerBuilder} from "../../../src/server/entity/server-types";

function createTypes(): TypeManager {
    const typesBundle: ServerSiteTypesBundle = new ServerSiteTypesBundle();
    const builder: ServerTypeManagerBuilder = new ServerTypeManagerBuilder();
    typesBundle.applyTypes(builder);
    return builder.build();
}

export const types: TypeManager = createTypes();

/**
 * 1
 *  - 11 (h)
 *  - 12
 *    - 121
 *  - 13
 * 2
 *  - 21 (h)
 *  - 22
 *    - 121 (r)
 *
 */

export const fixtures: Entity[] = [
    {
        data: [{
            childLinks: [10011, 10012, 10013],
            home: 11,
            host: "host1",
            name: "site1",
            notFound: 13,
            port: [1000],
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
            port: [0],
        }],
        id: 2,
        type: "site",
    },
    {
        data: [{
            children: [],
            homeOf: 1,
            name: "page11",
            parentLinks: [10011],
            paths: ["home"],
        }],
        id: 11,
        type: "page",
    },
    {
        data: [{
            childLinks: [120121, 120122],
            name: "page12",
            parentLinks: [10012],
            paths: ["about"],
        }],
        id: 12,
        type: "page",
    },
    {
        data: [{
            childLinks: [],
            name: "page13",
            parentLinks: [10013],
            paths: ["notfound"],
        }],
        id: 13,
        type: "page",
    },
    {
        data: [{
            childLinks: [],
            name: "page121",
            parentLinks: [120121],
            paths: ["ria"],
        }],
        id: 121,
        type: "page",
    },
    {
        data: [{
            childLinks: [],
            name: "page121",
            parentLinks: [120122, 220122],
            paths: ["ria2"],
        }],
        id: 122,
        type: "page",
    },
    {
        data: [{
            childLinks: [],
            homeOf: 2,
            name: "page21",
            parentLinks: [20021],
            paths: ["home"],
        }],
        id: 21,
        type: "page",
    },
    {
        data: [{
            childLinks: [220122],
            name: "page22",
            parentLinks: [20022],
            paths: ["about"],
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
            child: 12,
            parent: 1,
        }],
        id: 10012,
        type: "site_tree_link",
    },
    {
        data: [{
            child: 13,
            parent: 1,
        }],
        id: 10013,
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
    {
        data: [{
            child: 121,
            parent: 12,
        }],
        id: 120121,
        type: "site_tree_link",
    },
    {
        data: [{
            child: 122,
            parent: 12,
        }],
        id: 120122,
        type: "site_tree_link",
    },
    {
        data: [{
            child: 122,
            parent: 22,
        }],
        id: 220122,
        type: "site_tree_link",
    },
];
