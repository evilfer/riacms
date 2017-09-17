import {TypeManager} from "../../../src/common/types/type-manager";
import {Entity} from "../../../src/server/entity/entity";
import {EntityDb} from "../../../src/server/orm/entity-db";
import {RenderingCache} from "../../../src/server/orm/server-cache";
import {createFixtureDb} from "./fixture-db";

export function cacheGenerator(types: TypeManager, fixtures: Entity[]): (level: number) => RenderingCache {
    const db: EntityDb = createFixtureDb(types, fixtures);
    return (level: number = 0) => new RenderingCache(types, db, level);
}
