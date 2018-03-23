import * as Promise from "bluebird";
import {Pool, PoolClient} from "pg";
import {TypeManager} from "../../src/common/types/type-manager";
import {TypeFieldTypes} from "../../src/common/types/types";
import {Entity} from "../../src/server/entity/entity";
import {EntityDbFindValues, EntityQueryBuilder} from "../../src/server/orm/entity-db";
import {entityQueryAsPromise} from "./query-as-promise";

const FIND_QUERY_BASE = `
SELECT entity.eid, entity.type, entity.vid, version.data FROM entity LEFT JOIN version
ON entity.eid = version.eid AND entity.vid = version.vid
WHERE `;

type OperatorTypes = "CONTAINS" | "CONTAINS_ANY" | "EQ" | "EQ_ANY";

const OPERATORS: { [op: string]: [string, null | string] } = {
    CONTAINS: ["@>", null],
    CONTAINS_ANY: ["@> ANY (", ")"],
    CONTAINS_ANY_STR_ARR: ["? ANY (", ")"],
    CONTAINS_STR_ARR: ["?", null],
    EQ: ["=", null],
    EQ_ANY: ["= ANY (", ")"],
};

function getOperator(fieldType: TypeFieldTypes, op: OperatorTypes, value: any) {
    if (fieldType === "string[]") {
        if (op === "CONTAINS" && !(value as string).match(/^[0-9]+$/)) {
            return OPERATORS.CONTAINS_STR_ARR;
        }
        if (op === "CONTAINS_ANY") {
            return OPERATORS.CONTAINS_ANY_STR_ARR;
        }
    }

    return OPERATORS[op];
}

function createFieldPath(op: string, path: string[], fieldType: TypeFieldTypes): string {
    switch (fieldType) {
        case "string":
            return `(version.data -> ${path.slice(0, -1).join(" -> ")} ->> ${path[path.length - 1]})`;
        case "string[]":
            return `(version.data -> ${path.slice(0, -1).join(" -> ")} -> ${path[path.length - 1]})`;
        default:
            return `(version.data -> ${path.join(" -> ")})`;
    }
}

function getValueType(rel: string, fieldType: TypeFieldTypes, value: string): string {
    if (rel === "CONTAINS" && fieldType === "string[]"  && !(value as string).match(/^[0-9]+$/)) {
        return "::text";
    }
    return "";
}

export class PgJsonQueryBuilder implements EntityQueryBuilder {
    private types: TypeManager;
    private client: PoolClient | Pool;
    private level: number;
    private conditions: string[];
    private values: any[];

    constructor(types: TypeManager, client: PoolClient | Pool, level: number) {
        this.types = types;
        this.client = client;
        this.level = level;

        this.conditions = [];
        this.values = [];
    }

    public run(): Promise<Entity[]> {
        const query: string = FIND_QUERY_BASE + this.conditions.join(" AND ");
        return entityQueryAsPromise(this.client, query, this.values);
    }

    public idIn(ids: number[]): EntityQueryBuilder {
        this.values.push(ids);
        this.conditions.push(`entity.eid = ANY( $${this.values.length} )`);
        return this;
    }

    public implementsType(type: string): EntityQueryBuilder {
        this.values.push(this.types.getImplementedBy(type));
        this.conditions.push(`type = ANY( $${this.values.length} )`);
        return this;
    }

    public valueEquals(type: string, field: string, value: EntityDbFindValues): EntityQueryBuilder {
        this.addCondition(type, field, "EQ", value);
        return this;
    }

    public valueIn(type: string, field: string, values: EntityDbFindValues[]): EntityQueryBuilder {
        this.addCondition(type, field, "EQ_ANY", values);
        return this;
    }

    public arrayContains(type: string, field: string, value: EntityDbFindValues): EntityQueryBuilder {
        this.addCondition(type, field, "CONTAINS", value);
        return this;
    }

    public arrayContainsAny(type: string, field: string, values: EntityDbFindValues[]): EntityQueryBuilder {
        this.addCondition(type, field, "CONTAINS_ANY", values);
        return this;
    }

    private addCondition(type: string,
                         field: string,
                         rel: OperatorTypes,
                         value: any): void {

        const fieldType = this.types.getFieldType(type, field);
        if (fieldType !== null) {
            const [op, wrap] = getOperator(fieldType, rel, value);

            const mdMatch = field.match(/^_(.*)$/);
            this.values.push(value);
            const relValueStr = `${op} $${this.values.length}${getValueType(rel, fieldType, value)} ${wrap || ""}`;

            if (mdMatch) {
                this.conditions.push(`entity.${mdMatch[1]} ${relValueStr}`);
            } else {
                let condition = "";

                for (let i = this.level; i >= 0; i--) {
                    const pgFieldPath = `${i}.${field}`
                        .split(".")
                        .map(part => part.match(/^[0-9]+$/) ? part : `'${part}'`);

                    condition += `(${createFieldPath(op, pgFieldPath, fieldType)} ${relValueStr}`;

                    if (i > 0) {
                        const hasKey = `version.data ? '${i}' AND version.data -> ${i} ? ${pgFieldPath[1]}`;
                        condition += ` OR (NOT(${hasKey}) AND `;
                    }
                }

                condition += ")".repeat(this.level * 2 + 1);

                this.conditions.push(condition);
            }
        }
    }
}
