import {TypeManager} from "../../../src/common/types/type-manager";
import {ServerContext} from "../../../src/server/app/server-context";
import {ServerBundle} from "../../../src/server/bundles/server-bundle";
import {ServerBundleGroup} from "../../../src/server/bundles/server-bundle-group";
import {Entity} from "../../../src/server/entity/entity";
import {EntityDb} from "../../../src/server/orm/entity-db";
import {createFixtureDb} from "./fixture-db";

export function createFixtureServerContext(bundleList: ServerBundle[],
                                           types: TypeManager,
                                           fixtures: Entity[]): ServerContext {
    const db: EntityDb = createFixtureDb(types, fixtures);

    const bundles: ServerBundleGroup = new ServerBundleGroup(bundleList);

    return {types, db, bundles};
}
