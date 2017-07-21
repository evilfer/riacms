import {TypeDefinitionMap} from "../../../src/common/types/types";
import {Entity} from "../../../src/server/entity/entity";

export const typeMap: TypeDefinitionMap = {
    extendedPage: [
        {name: "name", type: "string"},
        {name: "subtitle", type: "string"},
    ],
    nestedMultiplePage: [
        {name: "name", type: "string"},
        {
            name: "nested",
            nestedFields: [
                {name: "value", type: "number"},
            ],
            type: "object[]",
        },
    ],
    nestedPage: [
        {name: "name", type: "string"},
        {
            name: "nested",
            nestedFields: [
                {name: "value", type: "number"},
            ],
            type: "object",
        },
    ],
    page: [
        {name: "name", type: "string"},
    ],
    relatedMultiplePage: [
        {name: "name", type: "string"},
        {name: "relatedMultiple", type: "related[]", relatedType: "page", inverseField: null},
    ],
    relatedPage: [
        {name: "name", type: "string"},
        {name: "related", type: "related", relatedType: "page", inverseField: null},
    ],
    site: [],
};

export const fixtures: Entity[] = [
    {
        data: [
            {name: "page1"},
            {name: "page1_updated"},
        ],
        id: 1,
        type: "page",
    },
    {
        data: [
            {name: "page2", subtitle: "st2"},
            {name: "page2_updated"},
        ],
        id: 2,
        type: "extendedPage",
    },
    {
        data: [{
            name: "page3",
            related: 1,
        }],
        id: 3,
        type: "relatedPage",
    },
    {
        data: [{
            name: "page4",
            relatedMultiple: [1, 3],
        }],
        id: 4,
        type: "relatedMultiplePage",
    },
    {
        data: [{
            name: "page5",
            nested: null,
        }],
        id: 5,
        type: "nestedPage",
    },
    {
        data: [{
            name: "page6",
            nested: {value: 4},
        }],
        id: 6,
        type: "nestedPage",
    },
    {
        data: [{
            name: "page7",
        }],
        id: 7,
        type: "nestedMultiplePage",
    },
    {
        data: [{
            name: "page8",
            nested: [{value: 1}, {value: 2}],
        }],
        id: 8,
        type: "nestedMultiplePage",
    },
];
