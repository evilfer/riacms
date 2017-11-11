import {TypeManager} from "../../../../../types/type-manager";
import {ObjectTypeField, RelatedTypeField, TypeField} from "../../../../../types/types";
import {FieldDefinition} from "../../forms/fields/field-definition";

function filteredFields(types: TypeManager, entity: any): TypeField[] {
    const fields = types.getFields(entity._type);
    const excludedFields = types.isA(entity, "page") ? ["childLinks", "parentLinks"] :
        (types.isA(entity, "site") ? ["childLinks"] : []);

    return fields.filter(field => !field.computed && excludedFields.indexOf(field.name) < 0);
}

function formField(types: TypeManager, dataField: TypeField): null | FieldDefinition {
    const typeMatch = dataField.type.match(/^([^\[\]]+)(\[])?$/);
    if (!typeMatch) {
        return null;
    }

    const type = typeMatch[1];
    const multiple = !!typeMatch[2];

    switch (type) {
        case "string":
            return {
                multiple,
                name: dataField.name,
                presentation: {
                    description: `Edit "${dataField.name}"`,
                    input: "text",
                    label: dataField.name,
                },
                type: "string",
            };

        case "number":
            return {
                multiple,
                name: dataField.name,
                presentation: {
                    description: `Edit "${dataField.name}"`,
                    input: "number",
                    label: dataField.name,
                },
                type: "number",
            };

        case "boolean":
            return {
                multiple,
                name: dataField.name,
                presentation: {
                    description: `Edit "${dataField.name}"`,
                    input: "checkbox",
                    label: dataField.name,
                },
                type: "boolean",
            };

        case "related":
            return {
                allowSubtypes: true,
                multiple,
                name: dataField.name,
                presentation: {
                    description: `Edit "${dataField.name}"`,
                    input: "picker",
                    label: dataField.name,
                },
                relatedType: (dataField as RelatedTypeField).relatedType,
                type: "related",
            };

        case "object":
            return {
                multiple,
                name: dataField.name,
                nestedFields: entityEditFields(types, {_type: (dataField as ObjectTypeField).nestedType}),
                presentation: {
                    description: `Edit "${dataField.name}"`,
                    input: "nested",
                    label: dataField.name,
                },
                type: "nested",
            };

        default:
            return null;
    }
}

export function entityEditFields(types: TypeManager, entity: any): FieldDefinition[] {
    return filteredFields(types, entity)
        .map(field => formField(types, field))
        .filter(field => !!field) as FieldDefinition[];
}
