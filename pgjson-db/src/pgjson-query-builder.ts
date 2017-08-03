import * as Promise from "bluebird";
import {Client, Pool} from "pg";
import {Entity} from "../../src/server/entity/entity";
import {EntityDbFindValues, EntityQueryBuilder} from "../../src/server/orm/entity-db";
import {entityQueryAsPromise} from "./query-as-promise";

const FIND_QUERY_BASE = `
SELECT entity.eid, entity.type, entity.vid, version.data FROM entity LEFT JOIN version
ON entity.eid = version.eid AND entity.vid = version.vid
WHERE `;

export class PgJsonQueryBuilder implements EntityQueryBuilder {
    private client: Client | Pool;
    private level: number;
    private conditions: string[];
    private values: any[];

    constructor(client: Client | Pool, level: number) {
        this.client = client;
        this.level = level;

        this.conditions = [];
        this.values = [];
    }

    public run(): Promise<Entity[]> {
        const query: string = FIND_QUERY_BASE + this.conditions.join(" AND ");
        console.log(query, this.values);
        return entityQueryAsPromise(this.client, query, this.values);
    }

    public valueEquals(field: string, value: EntityDbFindValues): EntityQueryBuilder {
        this.addCondition(field, "=", value);
        return this;
    }

    public valueIn(field: string, values: EntityDbFindValues[]): EntityQueryBuilder {
        return this;
    }

    public arrayContains(field: string, value: EntityDbFindValues): EntityQueryBuilder {
        return this;
    }

    public arrayContainsAny(field: string, values: EntityDbFindValues[]): EntityQueryBuilder {
        return this;
    }

    private addCondition(field: string, relation: string, value: any, type: null | string = null): void {
        const mdMatch = field.match(/^_(.*)$/);
        this.values.push(value);
        const relValueStr = `${relation} $${this.values.length}${type ? ":" + type : ""}`;

        if (mdMatch) {
            this.conditions.push(`entity.${mdMatch[1]} ${relValueStr}`);
        } else {
            this.conditions.push(`version.data[0]->${field} ${relValueStr}`);
        }
    }
}
