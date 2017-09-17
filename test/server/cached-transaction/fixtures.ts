import {TypeManager} from "../../../src/common/types/type-manager";
import {TypeManagerBuilder} from "../../../src/common/types/type-manager-builder";
import {Entity} from "../../../src/server/entity/entity";

function createTypes(): TypeManager {
    const builder = new TypeManagerBuilder();

    builder.createConcreteType("simple", [
        {name: "name", type: "string"},
    ]);

    builder.createConcreteType("m2m", [
        {name: "r1", type: "related[]", inverseField: "r2", relatedType: "m2m"},
        {name: "r2", type: "related[]", inverseField: "r1", relatedType: "m2m"},
    ]);

    builder.createConcreteType("m2o", [
        {name: "r1", type: "related[]", inverseField: "r2", relatedType: "m2o"},
        {name: "r2", type: "related", inverseField: "r1", relatedType: "m2o"},
    ]);

    builder.createConcreteType("o2o", [
        {name: "r1", type: "related", inverseField: "r2", relatedType: "o2o"},
        {name: "r2", type: "related", inverseField: "r1", relatedType: "o2o"},
    ]);

    return builder.build();
}

export const types: TypeManager = createTypes();

export const fixtures: Entity[] = [
    {
        data: [{name: "page1"}],
        id: 1,
        type: "simple",
    },
    {
        data: [{r1: [], r2: []}],
        id: 2,
        type: "m2m",
    },
    {
        data: [{r1: [4], r2: []}],
        id: 3,
        type: "m2m",
    },
    {
        data: [{r1: [], r2: [3]}],
        id: 4,
        type: "m2m",
    },
    {
        data: [{r1: [], r2: null}],
        id: 5,
        type: "m2o",
    },
    {
        data: [{r1: [7], r2: null}],
        id: 6,
        type: "m2o",
    },
    {
        data: [{r1: [], r2: 6}],
        id: 7,
        type: "m2o",
    },
    {
        data: [{r1: null, r2: null}],
        id: 8,
        type: "o2o",
    },
    {
        data: [{r1: 10, r2: null}],
        id: 9,
        type: "o2o",
    },
    {
        data: [{r1: null, r2: 9}],
        id: 10,
        type: "o2o",
    },
];
