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
            children: [11],
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
            children: [21, 22],
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
            children: [],
            name: "page21",
            parents: [2],
            paths: ["home"],
            relatedPage: null,
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
            relatedPage: 21,
        }],
        id: 22,
        type: "page",
    },
];
