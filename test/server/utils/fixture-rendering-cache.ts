import {TypeManager} from "../../../src/common/types/type-manager";
import {ServerContext} from "../../../src/server/app/server-context";
import {ServerBundle} from "../../../src/server/bundles/server-bundle";
import {Entity} from "../../../src/server/entity/entity";
import {RenderingCache} from "../../../src/server/orm/cache";
import {createFixtureServerContext} from "./fixture-server-context";

export function cacheGenerator(bundles: ServerBundle[],
                               types: TypeManager,
                               fixtures: Entity[]): (level: number) => RenderingCache {
    const context: ServerContext = createFixtureServerContext(bundles, types, fixtures);
    return (level: number = 0) => new RenderingCache(types, context.db, level);
}
