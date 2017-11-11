import {FieldDefinition, LiteralFieldDefinition, NestedFieldDefinition} from "../fields/field-definition";
import {FieldListener, FieldManager} from "./abstract-field-manager";
import {LiteralValueSingleFieldManager} from "./literal-single-field-manager";
import {MultipleValuesFieldManager} from "./multiple-values-field-manager";
import {NestedFieldManager} from "./nested-field-manager";

export function createFieldManager(parent: FieldListener, def: FieldDefinition, savedValue?: any): FieldManager<any> {
    if (def.multiple) {
        return new MultipleValuesFieldManager(parent, def, savedValue);
    }

    if (def.type === "nested") {
        return new NestedFieldManager(parent, def as NestedFieldDefinition, savedValue);
    } else {
        return new LiteralValueSingleFieldManager(parent, def as LiteralFieldDefinition, savedValue);
    }
}
