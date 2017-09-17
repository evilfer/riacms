import {TypeManager} from "../../../src/common/types/type-manager";
import {TypeManagerBuilder} from "../../../src/common/types/type-manager-builder";

function createTypes(): TypeManager {
    const builder = new TypeManagerBuilder();

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

    return builder.build();
}

export const types: TypeManager = createTypes();

export const fixtures: { [id: number]: any } = {
    1: {
        _data: [{name: "page1"}, {name: "page1b"}],
        _type: "page",
        name: "page1",
    },
    2: {
        _type: "extendedPage",
        name: "page2",
        subtitle: "st2",
    },
    21: {
        _type: "extendedPage",
    },
    3: {
        _type: "relatedPage",
        name: "page3",
        related: 1,
    },
    31: {
        _type: "relatedPage",
        name: "page3",
        related: 100,
    },
    4: {
        _type: "relatedMultiplePage",
        name: "page4",
        relatedMultiple: [1, 3],
    },
    41: {
        _type: "relatedMultiplePage",
        name: "page4",
        relatedMultiple: [1, 101, 3, 102],
    },
    42: {
        _type: "relatedMultiplePage",
        name: "page4"
    },
    5: {
        _type: "nestedPage",
        name: "page5",
        nested: null,
    },
    51: {
        _type: "nestedPage",
        name: "page5",
    },
    6: {
        _type: "nestedPage",
        name: "page6",
        nested: {value: 4},
    },
    61: {
        _type: "nestedPage",
        name: "page6",
        nested: {},
    },
    7: {
        _type: "nestedMultiplePage",
        name: "page7",
        nested: [
            {value: 1},
            {value: 2},
            {},
        ],
    },
    71: {
        _type: "nestedMultiplePage",
        name: "page71",
    },
};
