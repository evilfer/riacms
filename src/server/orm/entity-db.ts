import * as Promise from "bluebird";
import {Entity} from "../entity/entity";

export type EntityDbFindValues = null | boolean | number | string;

export interface QueryBuilder {
    valueEquals: (field: string, value: null | string | boolean | number) => QueryBuilder;
    valueIn: (field: string, values: Array<null | string | boolean | number>) => QueryBuilder;
    arrayContains: (field: string, value: null | string | boolean | number) => QueryBuilder;
    arrayContainsAny: (field: string, values: Array<null | string | boolean | number>) => QueryBuilder;
}

export interface EntityQueryBuilder extends QueryBuilder {
    run: () => Promise<Entity[]>;
}

export interface EntityDb {
    load: (id: number) => Promise<Entity>;
    loadMultiple: (ids: number[]) => Promise<Entity[]>;
    find: (level: number) => EntityQueryBuilder;
}
