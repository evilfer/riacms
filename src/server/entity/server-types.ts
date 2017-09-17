import * as Promise from "bluebird";
import {EntityContent, EntityContentValue} from "../../common/cache/entity-content";
import {TypeManagerBuilder} from "../../common/types/type-manager-builder";
import {BaseTypeField, TypeField} from "../../common/types/types";
import {ServerContext} from "../app/server-context";
import {ServerRequestContext} from "../bundles/server-bundle";

export interface ServerComputedEntityMetadata {
    id: null | number;
    type: string;
}

export type ServerComputedFieldFunc = (content: EntityContent,
                                       metadata: ServerComputedEntityMetadata,
                                       ctx: ServerContext,
                                       req: ServerRequestContext) => EntityContentValue | Promise<EntityContentValue>;

export interface ServerBaseTypeField extends BaseTypeField {
    impl: ServerComputedFieldFunc;
}

export class ServerTypeManagerBuilder extends TypeManagerBuilder {

    public implementComputed(type: string, fieldName: string, f: ServerComputedFieldFunc) {
        if (!this.types[type]) {
            throw new Error(`Type "${type}" does not exist`);
        }

        const field: undefined | TypeField = this.types[type].fields.find(({name}) => name === fieldName);

        if (!field) {
            throw new Error(`Type "${parent}" does not have type "${fieldName}"`);
        }

        if (!field.computed) {
            throw new Error(`Field "${parent}"."${fieldName}" is not a computed field`);
        }

        (field as ServerBaseTypeField).impl = f;
    }
}
