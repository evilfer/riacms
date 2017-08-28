import * as extend from "extend";
import {EntityContent} from "../../common/cache/entity-content";

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
