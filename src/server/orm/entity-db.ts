import * as Promise from "bluebird";
import {Entity, EntityContent} from "../entity/entity";

export type EntityDbFindValues = null | boolean | number | string;

export interface QueryBuilder<E extends QueryBuilder<any>> {
    idIn: (ids: number[]) => E;
    implementsType: (type: string) => E;
    valueEquals: (type: string, field: string, value: EntityDbFindValues) => E;
    valueIn: (type: string, field: string, values: EntityDbFindValues[]) => E;
    arrayContains: (type: string, field: string, value: EntityDbFindValues) => E;
    arrayContainsAny: (type: string, field: string, values: EntityDbFindValues[]) => E;
}

export interface EntityQueryBuilder extends QueryBuilder<EntityQueryBuilder> {
    run: () => Promise<Entity[]>;
}

export interface EntityReadDb {
    load: (id: number) => Promise<Entity>;
    loadMultiple: (ids: number[]) => Promise<Entity[]>;
    find: (level: number) => EntityQueryBuilder;
}

export interface EntityDbWriteAction extends EntityReadDb {
    createEntity: (type: string, data: EntityContent[]) => Promise<Entity>;
    updateEntity: (eid: number, data: EntityContent[]) => Promise<Entity>;
    commit: () => Promise<boolean>;
}

export interface EntityDb extends EntityReadDb {
    action: (type: string, uid: number) => Promise<EntityDbWriteAction>;
}
