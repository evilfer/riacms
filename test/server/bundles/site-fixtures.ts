import {SiteTypesBundle} from "../../../src/common/bundles/site-types/site-types-bundle";
import {TypeManager} from "../../../src/common/types/type-manager";
import {TypeManagerBuilder} from "../../../src/common/types/type-manager-builder";
import {Entity} from "../../../src/server/entity/entity";

function createTypes(): TypeManager {
    const typesBundle: SiteTypesBundle = new SiteTypesBundle();
    const builder: TypeManagerBuilder = new TypeManagerBuilder();
    typesBundle.applyTypes(builder);
    return builder.build();
}

export const types: TypeManager = createTypes();

export const fixtures: Entity[] = [
    {
        data: [{
            children: [11, 12, 13],
            home: 11,
            host: "host1",
            name: "site1",
            notFound: 13,
            port: 1000,
        }],
        id: 1,
        type: "site",
    },
    {
        data: [{
            children: [21, 22],
            home: 21,
            host: "*",
            name: "site2",
            notFound: 22,
            port: null,
        }],
        id: 2,
        type: "site",
    },
    {
        data: [{
            children: [],
            name: "page11",
            parents: [1],
            paths: ["home"],
        }],
        id: 11,
        type: "page",
    },
    {
        data: [{
            children: [121],
            name: "page12",
            parents: [1],
            paths: ["about"],
        }],
        id: 12,
        type: "page",
    },
    {
        data: [{
            children: [],
            name: "page13",
            parents: [1],
            paths: ["notfound"],
        }],
        id: 13,
        type: "page",
    },
    {
        data: [{
            children: [],
            name: "page121",
            parents: [12],
            paths: ["ria"],
        }],
        id: 121,
        type: "page",
    },
    {
        data: [{
            children: [],
            name: "page21",
            parents: [2],
            paths: ["home"],
        }],
        id: 21,
        type: "page",
    },
    {
        data: [{
            children: [],
            name: "page22",
            parents: [2],
            paths: ["about"],
        }],
        id: 22,
        type: "page",
    },
];
