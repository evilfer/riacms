export interface RenderEntity extends EntityContent {
    _id: number;
    _type: string;
}

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
