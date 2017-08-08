import {TypeManager} from "../../../src/common/types/type-manager";
import {TypeManagerBuilder} from "../../../src/common/types/type-manager-builder";
import {Entity} from "../../../src/server/entity/entity";

function createTypes(): TypeManager {
    const builder = new TypeManagerBuilder();

    builder.createConcreteType("extendedPage", [
        {name: "name", type: "string"},
        {name: "subtitle", type: "string"},
    ]);

    builder.createConcreteType("nestedMultiplePage", [
        {name: "name", type: "string"},
        {
            name: "nested",
            nestedFields: [
                {name: "value", type: "number"},
            ],
            type: "object[]",
        },
    ]);

    builder.createConcreteType("nestedPage", [
        {name: "name", type: "string"},
        {
            name: "nested",
            nestedFields: [
                {name: "value", type: "number"},
            ],
            type: "object",
        },
    ]);

    builder.createConcreteType("page", [
        {name: "name", type: "string"},
    ]);

    builder.createConcreteType("relatedMultiplePage", [
        {name: "name", type: "string"},
        {name: "relatedMultiple", type: "related[]", relatedType: "page", inverseField: null},
    ]);

    builder.createConcreteType("relatedPage", [
        {name: "name", type: "string"},
        {name: "related", type: "related", relatedType: "page", inverseField: null},
    ]);

    return builder.build();
}

export const types: TypeManager = createTypes();

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
