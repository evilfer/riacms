import {Entity} from "../entity/entity";

export interface EntityDb {
    load: (id: number) => Promise<Entity>;
    loadMultiple: (ids: number[]) => Promise<Entity[]>;
    find: (field: string, value: boolean | number | string) => Promise<Entity[]>;
}
