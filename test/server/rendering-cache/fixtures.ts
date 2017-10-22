import * as Promise from "bluebird";
import {TypeManager} from "../../../src/common/types/type-manager";
import {Entity} from "../../../src/server/entity/entity";
import {ServerTypeManagerBuilder} from "../../../src/server/entity/server-types";

export const computedFunctions = {
    asyncFunc: (proxy: any) => Promise.resolve(`hi ${proxy.name}`),
    compositeFunc: (proxy: any) => proxy.syncFunc,
    syncFunc: (proxy: any) => `hi ${proxy.name}`,
};

export function createTypes(): TypeManager {
    const builder = new ServerTypeManagerBuilder();

    builder.createConcreteType("extendedPage", [
        {name: "name", type: "string"},
        {name: "subtitle", type: "string"},
    ]);

    builder.createConcreteType("nestedNumber", [
        {name: "value", type: "number"},
    ]);

    builder.createConcreteType("nestedMultiplePage", [
        {name: "name", type: "string"},
        {
            name: "nested",
            nestedType: "nestedNumber",
            type: "object[]",
        },
    ]);

    builder.createConcreteType("nestedPage", [
        {name: "name", type: "string"},
        {
            name: "nested",
            nestedType: "nestedNumber",
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

    builder.createConcreteType("computed", [
        {name: "name", type: "string"},
        {name: "syncField", type: "string", computed: true},
        {name: "asyncField", type: "string", computed: true},
    ]);

    builder.implementComputed("computed", "syncField", computedFunctions.syncFunc);
    builder.implementComputed("computed", "asyncField", computedFunctions.asyncFunc);

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
            name: "page31",
        }],
        id: 31,
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
            name: "page42",
        }],
        id: 41,
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
            nested: {_type: "nestedNumber", value: 4},
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
            nested: [{_type: "nestedNumber", value: 1}, {_type: "nestedNumber", value: 2}],
        }],
        id: 8,
        type: "nestedMultiplePage",
    },
    {
        data: [{name: "name"}],
        id: 9,
        type: "computed",
    },
];
