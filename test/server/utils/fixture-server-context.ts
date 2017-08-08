import * as Promise from "bluebird";
import * as extend from "extend";
import {TypeManager} from "../../../src/common/types/type-manager";
import {InstantiateStores, ServerContext} from "../../../src/server/app/server-context";
import {ServerBundle, ServerBundleDataInitMap, ServerRequestContext} from "../../../src/server/bundles/server-bundle";
import {Entity, EntityContent, getEntityContent} from "../../../src/server/entity/entity";
import {EntityQueryBuilder, EntityReadDb} from "../../../src/server/orm/entity-db";

export function createFixtureServerContext(bundles: ServerBundle[],
                                           types: TypeManager,
                                           fixtures: Entity[]): ServerContext {
    const fixtureMap = fixtures.reduce((acc, fixture) => {
        acc[fixture.id] = fixture;
        return acc;
    }, {} as { [id: number]: Entity });

    const find: (level: number) => EntityQueryBuilder = level => {
        let list = fixtures.map(entity => ({
            content: getEntityContent(entity, level),
            entity,
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

    const db: EntityReadDb = {
        find,
        load: id => Promise.resolve(fixtureMap[id]),
        loadMultiple: ids => Promise.resolve(ids.map(id => fixtureMap[id])),
    };

    const declaredStores: ServerBundleDataInitMap = bundles.reduce((acc, bundle) => {
        const stores = bundle.declareRenderingStores();
        if (stores !== null) {
            extend(acc, stores);
        }
        return acc;
    }, {});

    const declaredStoreNames = Object.keys(declaredStores);

    const instantiateStores: InstantiateStores = context => Promise.reduce(declaredStoreNames, (acc, name: string) => {
        return declaredStores[name](context).then((value: any) => {
            acc[name] = value;
            return acc;
        });
    }, {} as { [name: string]: any });

    const declaredDataServices = bundles.reduce((acc, bundle) => {
        const services = bundle.declareRequestDataServices();
        extend(acc, services);
        return acc;
    }, {} as ServerBundleDataInitMap);

    const dataService = (name: string, requestContext: ServerRequestContext) =>
        declaredDataServices[name](requestContext);

    return {types, db, instantiateStores, dataService};
}
