import {Entity} from "../../../src/server/entity/entity";
import {RenderingCache} from "../../../src/server/orm/cache";
import {EntityDb} from "../../../src/server/orm/entity-db";
import {fixtures, types} from "./fixtures";

const fixtureMap = fixtures.reduce((acc, fixture) => {
    acc[fixture.id] = fixture;
    return acc;
}, {} as { [id: number]: Entity });

export const fixtureDb: EntityDb = {
    find: () => Promise.resolve([]),
    load: id => Promise.resolve(fixtureMap[id]),
    loadMultiple: ids => Promise.resolve(ids.map(id => fixtureMap[id])),
};

export function newFixtureCache(level: number = 0): RenderingCache {
    return new RenderingCache(types, fixtureDb, level);
}
