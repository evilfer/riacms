import * as Promise from "bluebird";
import {Client, Pool, QueryResult} from "pg";
import {Entity} from "../../src/server/entity/entity";

export function queryAsPromise(client: Client | Pool, query: string, values: any[] = []): Promise<QueryResult> {
    return new Promise((resolve, reject) => {
        client.query(query, values, (err, result: QueryResult) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

export function entityQueryAsPromise(client: Client | Pool, query: string, values: any[] = []): Promise<Entity[]> {
    return queryAsPromise(client, query, values)
        .then(result => result.rows.map(row => ({data: row.data, id: row.eid, type: row.type})));
}
