import * as extend from "extend";
import {TypeManager} from "../../../src/common/types/type-manager";
import {InstantiateStores, ServerContext} from "../../../src/server/app/server-context";
import {ServerBundle, ServerBundleStores} from "../../../src/server/bundles/server-bundle";
import {Entity, getEntityContent} from "../../../src/server/entity/entity";
import {EntityDb, EntityQueryBuilder} from "../../../src/server/orm/entity-db";

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

        const builder = {
            arrayContains: (field: string, value: null | string | boolean | number) => {
                list = list.filter(({content}) => content[field] && content[field].indexOf(value) >= 0);
                return builder;
            },
            arrayContainsAny: (field: string, values: Array<null | string | boolean | number>) => {
                list = list.filter(({content}) => {
                    return values.some(value => content[field] && content[field].indexOf(value) >= 0);
                });
                return builder;
            },
            run: () => Promise.resolve(list.map(({entity}) => entity)),
            valueEquals: (field: string, value: null | string | boolean | number) => {
                list = list.filter(({content}) => content[field] === value);
                return builder;
            },
            valueIn: (field: string, values: Array<null | string | boolean | number>) => {
                list = list.filter(({content}) => values.indexOf(content[field]) >= 0);
                return builder;
            },
        };

        return builder;
    };

    const db: EntityDb = {
        find,
        load: id => Promise.resolve(fixtureMap[id]),
        loadMultiple: ids => Promise.resolve(ids.map(id => fixtureMap[id])),
    };

    const declaredStores: ServerBundleStores = bundles.reduce((acc, bundle) => {
        const stores = bundle.declareRenderingStores();
        if (stores !== null) {
            extend(acc, stores);
        }
        return acc;
    }, {});

    const declaredStoreNames = Object.keys(declaredStores);

    const instantiateStores: InstantiateStores = context => declaredStoreNames.reduce((acc, name) => {
        acc[name] = declaredStores[name](context);
        return acc;
    }, {} as { [name: string]: any });

    return {types, db, instantiateStores};
}
