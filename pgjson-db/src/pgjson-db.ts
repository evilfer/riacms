import * as Promise from "bluebird";
import {Client, Pool, PoolConfig} from "pg";
import {TypeManager} from "../../src/common/types/type-manager";
import {EntityDb, EntityDbWriteAction} from "../../src/server/orm/entity-db";
import {PgjsonQueryManager} from "./pgjson-query-manager";
import {PgJsonWriteAction} from "./pgjson-write-action";

export class PgJsonDb extends PgjsonQueryManager<Pool> implements EntityDb {
    public constructor(settings: PoolConfig, types: TypeManager) {
        super(types, new Pool(settings));
    }

    public getPool(): Pool {
        return this.client;
    }

    public action(type: string, uid: number): Promise<EntityDbWriteAction> {
        return new Promise((resolve, reject) => {
            this.client.connect((err: Error, client: Client, done: () => void) => {
                if (err) {
                    return reject(err);
                }

                resolve(new PgJsonWriteAction(this.types, client, type, uid, done));
            });
        }).then((action: PgJsonWriteAction) => action.init());
    }
}
