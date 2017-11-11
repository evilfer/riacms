import * as Promise from "bluebird";
import {Client, QueryResult} from "pg";
import {EntityContent} from "../../src/common/cache/entity-content";
import {TypeManager} from "../../src/common/types/type-manager";
import {Entity} from "../../src/server/entity/entity";
import {EntityDbWriteTransaction} from "../../src/server/orm/entity-db";
import {PgjsonQueryManager} from "./pgjson-query-manager";
import {queryAsPromise} from "./query-as-promise";

const INSERT_ACTION_ROW = "INSERT INTO action (eid, vid, uid, type) VALUES (0, 0, $1, $2) RETURNING aid";
const SET_ACTION_DATA = "UPDATE action SET eid=$1, vid=$2 WHERE aid=$3";
const INSERT_ENTITY_ROW = "INSERT INTO entity (vid, type) VALUES (1, $1) RETURNING eid";
const INSERT_VERSION = "INSERT INTO version (eid, vid, aid, data) VALUES ($1, $2, $3, $4)";
const INC_VERSION = "UPDATE entity SET vid=(vid + 1) WHERE eid=$1 RETURNING vid";

export class PgJsonWriteAction extends PgjsonQueryManager<Client> implements EntityDbWriteTransaction {
    private done: null | (() => void);
    private type: string;
    private uid: number;
    private aid: number;
    private actionSet: boolean;

    constructor(types: TypeManager, client: Client, type: string, uid: number, done: () => void) {
        super(types, client);
        this.done = done;
        this.type = type;
        this.uid = uid;
        this.actionSet = false;
    }

    public init(): Promise<PgJsonWriteAction> {
        return this.queryAsPromiseOrRollback("BEGIN")
            .then(() => this.queryAsPromiseOrRollback(INSERT_ACTION_ROW, [this.uid, this.type]))
            .then(aiResult => {
                if (aiResult.rows.length !== 1) {
                    return Promise.reject(new Error("could not create action"));
                }

                this.aid = aiResult.rows[0].aid;
                return Promise.resolve(this);
            });
    }

    public createEntity(type: string, data: EntityContent[]): Promise<Entity> {
        return this.queryAsPromiseOrRollback(INSERT_ENTITY_ROW, [type])
            .then(eiResult => {
                if (eiResult.rows.length !== 1) {
                    return Promise.reject(new Error("could not create action"));
                }

                const eid = eiResult.rows[0].eid;

                return this.queryAsPromiseOrRollback(INSERT_VERSION, [eid, 1, this.aid, JSON.stringify(data)])
                    .then(() => this.updateActionAndLoad(eid, 1));
            });
    }

    public updateEntity(eid: number, data: EntityContent[]): Promise<Entity> {
        return this.queryAsPromiseOrRollback(INC_VERSION, [eid])
            .then(ivResult => {
                if (ivResult.rows.length !== 1) {
                    return Promise.reject("could not increment version number");
                }

                const vid = ivResult.rows[0].vid;

                return this.queryAsPromiseOrRollback(INSERT_VERSION, [eid, vid, this.aid, JSON.stringify(data)])
                    .then(() => this.updateActionAndLoad(eid, vid));
            });
    }

    public commit(): Promise<boolean> {
        return this.queryAsPromiseOrRollback("COMMIT")
            .then(() => {
                if (this.done !== null) {
                    this.done();
                }
                return true;
            });
    }

    protected queryAsPromiseOrRollback(query: string, values: any[] = []): Promise<QueryResult> {
        return queryAsPromise(this.client, query, values)
            .catch(err => {
                if (this.done === null) {
                    return Promise.reject(err);
                }

                return queryAsPromise(this.client, "ROLLBACK")
                    .finally(() => {
                        if (this.done != null) {
                            this.done();
                            this.done = null;
                        }
                        return Promise.reject(err);
                    });
            });
    }

    private updateActionAndLoad(eid: number, vid: number): Promise<Entity> {
        if (!this.actionSet) {
            this.actionSet = true;
            return this.queryAsPromiseOrRollback(SET_ACTION_DATA, [eid, vid, this.aid])
                .then(() => this.load(eid));
        } else {
            return this.load(eid);
        }
    }
}
