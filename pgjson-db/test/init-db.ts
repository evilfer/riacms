import * as Promise from "bluebird";
import * as extend from "extend";
import {PgJsonDb} from "../src/pgjson-db";
import {queryAsPromise} from "../src/query-as-promise";
import connectionOptions from "./connection-options";
import {types} from "./fixtures";

export function initDb(): Promise<PgJsonDb> {
    const db = new PgJsonDb(extend({}, connectionOptions, {
        Promise,
        max: 10,
        min: 0,
    }), types);

    const pool = db.getPool();

    return queryAsPromise(pool, "TRUNCATE TABLE version")
        .then(() => queryAsPromise(pool, "TRUNCATE TABLE action"))
        .then(() => queryAsPromise(pool, "TRUNCATE TABLE entity"))
        .then(() => db);
}
