import * as Promise from "bluebird";
import {Client, Pool} from "pg";
import {Entity} from "../../src/server/entity/entity";
import {EntityQueryBuilder, EntityReadDb} from "../../src/server/orm/entity-db";
import {PgJsonQueryBuilder} from "./pgjson-query-builder";
import {entityQueryAsPromise} from "./query-as-promise";
import {TypeManager} from "../../src/common/types/type-manager";

const FIND_ENTITY = `
SELECT entity.eid, entity.type, entity.vid, version.data FROM entity LEFT JOIN version
ON entity.eid = version.eid AND entity.vid = version.vid
WHERE entity.eid = $1`;

const FIND_ENTITIES = `
SELECT entity.eid, entity.type, entity.vid, version.data FROM entity LEFT JOIN version
ON entity.eid = version.eid AND entity.vid = version.vid
WHERE entity.eid = ANY( $1 )`;

export class PgjsonQueryManager<E extends Client | Pool> implements EntityReadDb {

    protected types: TypeManager;
    protected client: E;

    constructor(types: TypeManager, client: E) {
        this.types = types;
        this.client = client;
    }

    public load(id: number): Promise<Entity> {
        return entityQueryAsPromise(this.client, FIND_ENTITY, [id])
            .then((entities: Entity[]) => {
                if (entities.length === 0) {
                    return Promise.reject(new Error(`${id} not found`));
                } else {
                    return entities[0];
                }
            });
    }

    public loadMultiple(ids: number[]): Promise<Entity[]> {
        return entityQueryAsPromise(this.client, FIND_ENTITIES, [ids]);
    }

    public find(level: number): EntityQueryBuilder {
        return new PgJsonQueryBuilder(this.types, this.client, level);
    }
}
