import {CacheDb, RenderingCache} from "../../../src/server/cache/cache";
import {Entity} from "../../../src/server/entity/entity";
import {fixtures, typeMap} from "./fixtures";

const fixtureMap = fixtures.reduce((acc, fixture) => {
    acc[fixture.id] = fixture;
    return acc;
}, {} as { [id: number]: Entity });

export const fixtureDb: CacheDb = {
    load: id => Promise.resolve(fixtureMap[id]),
    loadMultiple: ids => Promise.resolve(ids.map(id => fixtureMap[id])),
};

export function newFixtureCache(level: number = 0): RenderingCache {
    return new RenderingCache(typeMap, fixtureDb, level);
}
