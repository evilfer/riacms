import * as extend from "extend";

export interface EntityContent {
    [name: string]: null | number | number[] | string | string[] | EntityContent | EntityContent[];
}

export interface Entity {
    id: number;
    type: string;
    data: EntityContent[];
}

export function getEntityContent(entity: Entity, level: number) {
    return extend.apply(null, [{}, ...entity.data.slice(0, level + 1)]);
}
