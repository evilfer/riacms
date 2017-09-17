import * as Promise from "bluebird";
import * as clone from "clone";
import {EntityContent} from "../../../src/common/cache/entity-content";
import {TypeManager} from "../../../src/common/types/type-manager";
import {Entity, getEntityContent} from "../../../src/server/entity/entity";
import {EntityDb, EntityDbWriteTransaction, EntityQueryBuilder} from "../../../src/server/orm/entity-db";

export interface FixtureDb extends EntityDb {
    fixtureMap: { [id: number]: Entity };
}

export function createFixtureDb(types: TypeManager,
                                originalFixtures: Entity[]): FixtureDb {
    const fixtureMap = originalFixtures.reduce((acc, fixture) => {
        acc[fixture.id] = clone(fixture);
        return acc;
    }, {} as { [id: number]: Entity });

    const find: ((level: number) => EntityQueryBuilder) = level => {
        let list = Object.keys(fixtureMap).map((id: any) => ({
            content: getEntityContent(fixtureMap[id], level),
            entity: fixtureMap[id],
        }));

        const fieldValue: (e: { content: EntityContent, entity: Entity }, field: string) => any =
            (e, field) => e.content[field];

        const builder = {
            arrayContains: (type: string, field: string, value: null | string | boolean | number) => {
                list = list.filter(e => fieldValue(e, field) && fieldValue(e, field).indexOf(value) >= 0);
                return builder;
            },
            arrayContainsAny: (type: string, field: string, values: Array<null | string | boolean | number>) => {
                list = list.filter(e => {
                    return values.some(value => fieldValue(e, field)
                        && fieldValue(e, field).indexOf(value) >= 0);
                });
                return builder;
            },
            idIn: (ids: number[]) => {
                list = list.filter(e => ids.indexOf(e.entity.id) >= 0);
                return builder;
            },
            implementsType: (type: string) => {
                list = list.filter(e => types.getImplementedBy(type).indexOf(e.entity.type) >= 0);
                return builder;
            },
            run: () => Promise.resolve(list.map(({entity}) => entity)),
            valueEquals: (type: string, field: string, value: null | string | boolean | number) => {
                list = list.filter(e => fieldValue(e, field) === value);
                return builder;
            },
            valueIn: (type: string, field: string, values: Array<null | string | boolean | number>) => {
                list = list.filter(e => values.indexOf(fieldValue(e, field)) >= 0);
                return builder;
            },
        };

        return builder;
    };

    const load = (id: number) => Promise.resolve(fixtureMap[id]);
    const loadMultiple = (ids: number[]) => Promise.resolve(ids.map(id => fixtureMap[id]));

    const transaction: (txType: string, uid: number) => Promise<EntityDbWriteTransaction> = (txType, uid) => {
        const createEntity = (type: string, data: EntityContent[]) => {
            const newId = Math.max.apply(null, [0, ...Object.keys(fixtureMap).map(id => parseInt(id, 10))]) + 1;
            const entity: Entity = {
                data,
                id: newId,
                type,
            };
            fixtureMap[newId] = entity;
            return Promise.resolve(entity);
        };
        const updateEntity = (eid: number, data: EntityContent[]) => {
            fixtureMap[eid].data = data;
            return Promise.resolve(fixtureMap[eid]);
        };
        const commit = () => {
            return Promise.resolve(true);
        };

        const writeAction: EntityDbWriteTransaction = {
            commit,
            createEntity,
            find,
            load,
            loadMultiple,
            updateEntity,
        };

        return Promise.resolve(writeAction);
    };

    return {
        find,
        fixtureMap,
        load,
        loadMultiple,
        transaction,
    };
}
