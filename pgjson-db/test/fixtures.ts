import {TypeManager} from "../../src/common/types/type-manager";
import {TypeManagerBuilder} from "../../src/common/types/type-manager-builder";

export const types: TypeManager = (() => {
    const builder: TypeManagerBuilder = new TypeManagerBuilder();
    builder.createConcreteType("t1", [
        {name: "a", type: "number"},
        {name: "as", type: "number[]"},
        {name: "b", type: "string"},
        {name: "bs", type: "string[]"},
    ]);

    return builder.build();
})();

export const fixtures: Array<{ type: string, data: any[] }> = [
    {type: "t1", data: [{a: 1, b: "a", as: [0], bs: ["a", "b", "d"]}, {a: 10}]},
    {type: "t1", data: [{a: 2, b: "b", as: [0, 1], bs: ["a"]}, {a: 3}]},
    {type: "t1", data: [{a: 3, b: null, as: [1, 2], bs: ["b", "c"]}, {}]},
    {type: "t1", data: [{a: 4, b: "c", as: [1, 2, 3], bs: []}, {}]},
    {type: "t1", data: [{a: 5, b: "d", as: [2, 3, 4]}, {}]},
    {type: "t2", data: [{a: 1, b: "a", as: []}, {}]},
    {type: "t2", data: [{a: 2, b: "b", as: []}, {}]},
    {type: "t2", data: [{a: 3, b: "9"}]},
    {type: "t2", data: [{a: 4, b: "10", as: []}, {}]},
    {type: "t2", data: [{a: 5, b: "d", as: []}, {}]},
];
