import * as extend from "extend";

export type EntityContentValue =
    null
    | boolean
    | boolean[]
    | number
    | number[]
    | string
    | string[]
    | EntityContent
    | EntityContent[];

export interface EntityContent {
    [name: string]: EntityContentValue;
}

export interface Entity {
    id: number;
    type: string;
    data: EntityContent[];
}

export function getEntityContent(entity: Entity, level: number): EntityContent {
    return extend.apply(null, [{
        _id: entity.id,
        _type: entity.type,
    }, ...entity.data.slice(0, level + 1)]);
}
